import {HttpException, Inject, Injectable} from '@nestjs/common';
import {HttpUtil} from '../../utils/http.util';
import dhlApi from '../../config/dhl/api.config';
import { __ as t } from 'i18n';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/dhl/token.entity';
import {In, Repository} from 'typeorm';
import * as moment from 'moment';
import {DhlTrackingReqBody} from '../../interfaces/dhl/dhl.tracking.req.body';
import {DhlReqHeader} from '../../interfaces/dhl/dhl.req.header';
import {DhlDeleteReqBody} from '../../interfaces/dhl/dhl.delete.req.body';
import {ShipmentItemsEntity} from '../../model/dhl/shipment.items.entity';
const dhlKey = require('../../config/dhl/key.config.json');
const _ = require('underscore');
@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @InjectRepository(ShipmentItemsEntity) private readonly itemsRepository: Repository<ShipmentItemsEntity>,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
    ) {}
    async tracking(referenceNumber: string[]) {
        const token: TokenEntity | undefined = await this.tokenRepository.findOne();
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const params: DhlTrackingReqBody = {
            customerAccountId: undefined,
            pickupAccountId: dhlKey.PICKUPAccount,
            soldToAccountId: dhlKey.SOLDTOAccount,
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
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.tracking}`, body);
        return result;
    }
    /**
     * 国际发货只能在关闭前删除，国内发货只能在DHL提货/处理前取消。暂时未写返回值
     * @param shipmentID
     */
    async deleteOrCancelShipments(shipmentIDs: string[]) {
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
                throw new HttpException(t('Domestic shipments can only be cancelled before Pick-up / Processing by DHL.'),  404);
            }
            // 国际发货只能在关闭前删除
            if (key.shipment.pickupAddress.country === key.consigneeAddress.country && key.parcelStatus === 3) {
                throw new HttpException(t('International shipments can only be deleted before close out'), 404);
            }
            array.push(key.shipmentID);
        });
        // 判断需要取消订单是否有差异
        const noExit = _.difference(shipmentIDs, array);
        if (noExit.length > 0) {
            throw new HttpException(t('Shipment with id [%s] is not exit', noExit.toString()), 404);
        }
        const token: TokenEntity | undefined = await this.tokenRepository.findOne();
        if (!token) {
            throw new HttpException('token配置不存在', 404);
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
            pickupAccountId: dhlKey.PICKUPAccount,
            soldToAccountId: dhlKey.SOLDTOAccount,
            shipmentItems: items,
        };
        const body = {deleteShipmentReq : { hdr: header, bd: params}};
        // 此处应有返回值， 针对返回状态对数据进行处理
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.deleteOrCancel}`, body);
        await this.itemsRepository.update(shipmentIDs, {parcelStatus: 4});
    }
}