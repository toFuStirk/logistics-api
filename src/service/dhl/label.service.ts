import {HttpException, Inject, Injectable} from '@nestjs/common';
import {HttpUtil} from '../../utils/http.util';
import { __ as t } from 'i18n';
import dhlApi from '../../config/dhl/api.config';
import {DhlLabelReqBody, ShipmentItems} from '../../interfaces/dhl/dhl.label.req.body';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/dhl/token.entity';
import {In, Not, Repository} from 'typeorm';
import {DhlReqHeader} from '../../interfaces/dhl/dhl.req.header';
import * as moment from 'moment';
import {ShipmentEntity} from '../../model/dhl/shipment.entity';
import {ShipmentItemsEntity} from '../../model/dhl/shipment.items.entity';
import {UuidUtil} from '../../utils/uuid.util';
import {DhlDeleteReqBody} from '../../interfaces/dhl/dhl.delete.req.body';
const dhlKey = require('../../config/dhl/key.config.json');
const _ = require('underscore');
@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @InjectRepository(ShipmentEntity) private readonly labelRepository: Repository<ShipmentEntity>,
        @InjectRepository(ShipmentItemsEntity) private readonly itemsRepository: Repository<ShipmentItemsEntity>,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
        @Inject(UuidUtil) private readonly uuidUtil: UuidUtil
    ) {}

    /**
     * 数据库存储标签以及发货量
     * @param _body
     * @constructor
     */
    async LabelTheDelivery(_body: DhlLabelReqBody) {
        // 获取所有shipmentId
       const shipmentIdArray: string[] = [];
        _body.shipmentItems.forEach((key, value) => {
            shipmentIdArray.push(key.shipmentID);
        });
        // 判断shipmentId是否重复
        const count =  await this.itemsRepository.count({shipmentID: In(shipmentIdArray)});
        if (count > 0) {
            throw new HttpException(`${t('ShipmentId already exist')}`, 404);
        }
        const label = await this.labelRepository.save(await this.labelRepository.create({
            id: undefined,
            pickupAddress: _body.pickupAddress,
            label: _body.label,
            shipperAddress: _body.shipperAddress,
        }));
        for (const t in _body.shipmentItems) {
            _body.shipmentItems[t].parentId = label.id;
            _body.shipmentItems[t].shipmentNo = `MYBRU${await  this.uuidUtil.uuids(14, 10)}`;
            console.log('长度', _body.shipmentItems[t].shipmentNo);
        }
        await this.itemsRepository.save(_body.shipmentItems);
    }

    /**
     * 标签生成， 支持100 出货量, 暂时没有写返回值
     * @param labelId
     */
    async createLabel(labelId ?: number) {
        const shipments = [];
        if (labelId) {
            shipments.push(
                await this.labelRepository.findOne({where: {id: labelId}, relations: ['shipmentItems']}));
        } else {
            shipments.push(
                ...await this.labelRepository.find({
                  where: {
                      status: Not(1)
                  },
                  take: 100,
                  relations: ['shipmentItems']
              })
            );
        }
        const token: TokenEntity | undefined = await this.tokenRepository.findOne();
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const params: DhlLabelReqBody[] = [];
        shipments.forEach((key, value) => {
            const labelReqBody: DhlLabelReqBody = {
                customerAccountId: undefined,
                pickupAccountId: dhlKey.PICKUPAccount,
                soldToAccountId: dhlKey.SOLDTOAccount,
                pickupDateTime: moment(new Date()).utcOffset('+08:00').format(),
                inlineLabelReturn: 'Y',
                handoverMethod: undefined,
                pickupAddress: key.pickupAddress,
                shipperAddress: key.shipperAddress,
                shipmentItems: key.shipmentItems,
                label: key.label
            };
            params.push(labelReqBody);
        });
        const header: DhlReqHeader = {
            messageType: 'LABEL',
            messageDateTime: moment(new Date()).utcOffset('+08:00').format(),
            accessToken: token.token,
            messageLanguage: 'zh_CN',
            messageVersion: '1.4'
        };
        const body = {labelRequest : { hdr: header, bd: params}};
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.label}`, body);
        console.log(result);
    }

    /**
     * 编辑、生成和接收已编辑的配送服务的新标签
     */
    async shippingLabelEdit(_body: DhlLabelReqBody) {
        const shippment = await this.labelRepository.findOne();
    }
}