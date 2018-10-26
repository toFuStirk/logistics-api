import {HttpException, Inject, Injectable} from '@nestjs/common';
import {HttpUtil} from '../../utils/http.util';
import dhlApi from '../../config/logistic/dhl.config';
import { __ as t } from 'i18n';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/logistic/token.entity';
import {In, Repository} from 'typeorm';
import * as moment from 'moment';
import {DhlTrackingReqBody} from '../../interfaces/logistic/dhl/dhl.tracking.req.body';
import {DhlReqHeader} from '../../interfaces/logistic/dhl/dhl.req.header';
import {DhlDeleteReqBody} from '../../interfaces/logistic/dhl/dhl.delete.req.body';
import {ShipmentItemsEntity} from '../../model/logistic/shipment.items.entity';
import {DhlCloseOutReqBody} from '../../interfaces/logistic/dhl/dhl.closeOut.req.body';
import {DhlTrackingResBody} from '../../interfaces/logistic/dhl/dhl.tracking.res.body';
import {TrackingEntity} from '../../model/logistic/tracking.entity';
import {TokenService} from '../logistic/token.service';
import {LogisticsTypeService} from '../logistic/logistics.type.service';
import {LogisticConfigEntity} from '../../model/logistic/logistic.config.entity';
const _ = require('underscore');
@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(ShipmentItemsEntity) private readonly itemsRepository: Repository<ShipmentItemsEntity>,
        @InjectRepository(TrackingEntity) private readonly trackRepository: Repository<TrackingEntity>,
        @Inject(LogisticsTypeService) private readonly typeService: LogisticsTypeService,
        @Inject(TokenService) private readonly tokenService: TokenService,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
    ) {}

    /**
     * 查询物流信息
     * @param referenceNumber
     */
    async tracking(referenceNumber: string[]) {
        const config: LogisticConfigEntity = await this.typeService.findLogisticConfigByName('DHL');
        if (!config) {
            throw new HttpException('供应商配置信息不存在', 404);
        }
        const token: TokenEntity | undefined = await this.tokenService.findTokenByTypeName(config.logisticsProviderName);
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const params: DhlTrackingReqBody = {
            customerAccountId: undefined,
            pickupAccountId: config.PICKUPAccount,
            soldToAccountId: config.SOLDTOAccount,
            ePODRequired: 'Y',
            trackingReferenceNumber: referenceNumber
        };
        const header: DhlReqHeader = {
            messageType: 'TRACKITEM',
            accessToken: token.token,
            messageDateTime: moment(new Date()).utcOffset('+08:00').format(),
            messageVersion: '1.0',
            messageLanguage: 'zh_CN'
        };
        const body = {trackItemRequest : { hdr: header, bd: params}};
        const result: DhlTrackingResBody = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.tracking}`, body);
        // 此处直接插入 追踪表
        await this.trackRepository.save(result.items);
        return result;
    }
    /**
     * 国际发货只能在关闭前删除，国内发货只能在DHL提货/处理前取消。暂时未写返回值
     * @param shipmentID
     */
    async deleteOrCancelShipments(shipmentIDs: string[]) {
        const config: LogisticConfigEntity = await this.typeService.findLogisticConfigByName('DHL');
        if (!config) {
            throw new HttpException('供应商配置信息不存在', 404);
        }
        const token: TokenEntity | undefined = await this.tokenService.findTokenByTypeName(config.logisticsProviderName);
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const shipments = await this.itemsRepository.find({
            where: {
                shipmentID: In(shipmentIDs)
            },
            relations: ['shipment']
        });
        const array: string[] = [];
        // 判断所有shipmentID 的状态
        shipments.map((key, value) => {
            // 国内发货， 只能在DHL提货/处理前取消。
            if (key.shipment.pickupAddress.country === key.consigneeAddress.country && (key.parcelStatus === 1 || key.parcelStatus === 2)) {
                console.log('抛出异常1');
                throw new HttpException(t('Domestic shipments can only be cancelled before Pick-up / Processing by DHL.'),  404);
            }
            // 国际发货只能在关闭前删除
            if (key.shipment.pickupAddress.country === key.consigneeAddress.country && key.parcelStatus === 3) {
                console.log('抛出异常2');
                throw new HttpException(t('International shipments can only be deleted before close out'), 404);
            }
            array.push(key.shipmentID);
        });
        // 判断需要取消订单是否有差异
        const noExit = _.difference(shipmentIDs, array);
        if (noExit.length > 0) {
            console.log('抛出异常3');
            // throw new HttpException(t('Shipment with id [%s] is not exit', noExit.toString()), 404);
        }
        const header: DhlReqHeader = {
            messageType: 'DELETESHIPMENT',
            messageDateTime: moment(new Date()).utcOffset('+08:00').format(),
            accessToken: token.token,
            messageLanguage: 'zh_CN',
            messageVersion: '1.4'
        };
        const items: {shipmentID: string}[] = [];
        shipmentIDs.map((key, value) => {
            const shipmentItem = {shipmentID: key};
            items.push(shipmentItem);
        });
        const params: DhlDeleteReqBody = {
            customerAccountId: undefined,
            pickupAccountId: config.PICKUPAccount,
            soldToAccountId: config.SOLDTOAccount,
            shipmentItems: items,
        };
        const body = {deleteShipmentReq : { hdr: header, bd: params}};
        // 此处应有返回值， 针对返回状态对数据进行处理
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.deleteOrCancel}`, body);
        await this.itemsRepository.update(shipmentIDs, {parcelStatus: 4});
    }

    /**
     *  关闭进行装运， 多次请求报错
     * @param shipmentItems
     */
    async closeOutShipments(shipmentItems: {shipmentID: string, bagID?: string} []) {
        const config: LogisticConfigEntity = await this.typeService.findLogisticConfigByName('DHL');
        if (!config) {
            throw new HttpException('供应商配置信息不存在', 404);
        }
        const token: TokenEntity | undefined = await this.tokenService.findTokenByTypeName(config.logisticsProviderName);
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const shipmentIDs = shipmentItems.map((key, value) => {
            return key.shipmentID;
        });
        const shipments = await this.itemsRepository.find({
            where: {
                shipmentID: In(shipmentIDs)
            },
            relations: ['shipment']
        });
        const array = shipments.map((key, value) => {
            return key.shipmentID;
        });
        // 判断不存在shipmentId
        const noExit = _.difference(shipmentIDs, array);
        if (noExit.length > 0) {
            throw new HttpException(t('Shipment with id [%s] is not exit', noExit.toString()), 404);
        }
        const header: DhlReqHeader = {
            messageType: 'CLOSEOUT',
            messageDateTime: moment(new Date()).utcOffset('+08:00').format(),
            accessToken: token.token,
            messageLanguage: 'zh_CN',
            messageVersion: '1.4'
        };
        const params: DhlCloseOutReqBody = {
            customerAccountId: undefined,
            pickupAccountId: config.PICKUPAccount,
            soldToAccountId: config.SOLDTOAccount,
            handoverID: undefined,
            generateHandover: 'Y',
            handoverMethod: 1,
            emailNotification: undefined,
            shipmentItems
        };
        const body = {closeOutRequest : { hdr: header, bd: params}};
        // 此处应有返回值， 针对返回状态对数据进行处理
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.closeOut}`, body);
    }
}