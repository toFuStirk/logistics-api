import {HttpException, Inject, Injectable} from '@nestjs/common';
import {HttpUtil} from '../../utils/http.util';
import dhlApi from '../../config/logistic/dhl.config';
import {DhlLabelReqBody} from '../../interfaces/logistic/dhl/dhl.label.req.body';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/logistic/token.entity';
import {Not, Repository} from 'typeorm';
import {DhlReqHeader} from '../../interfaces/logistic/dhl/dhl.req.header';
import * as moment from 'moment';
import {LabelShipmentEntity} from '../../model/logistic/shipment.entity';
import {ShipmentItemsEntity} from '../../model/logistic/shipment.items.entity';
import {UuidUtil} from '../../utils/uuid.util';
import {UserDeliveryService} from '../logistic/user.delivery.service';
import {ShippingManageEntity} from '../../model/logistic/shipping.manage.entity';
import {UserService} from '../user/user.service';
import {LogisticsTypeService} from '../logistic/logistics.type.service';
import {LogisticConfigEntity} from '../../model/logistic/logistic.config.entity';
import {TokenService} from '../logistic/token.service';
const _ = require('underscore');

@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(LabelShipmentEntity) private readonly labelRepository: Repository<LabelShipmentEntity>,
        @InjectRepository(ShipmentItemsEntity) private readonly itemsRepository: Repository<ShipmentItemsEntity>,
        @InjectRepository(ShippingManageEntity) private readonly manageRepo: Repository<ShippingManageEntity>,
        @Inject(UserDeliveryService) private readonly addressService: UserDeliveryService,
        @Inject(LogisticsTypeService) private readonly typeService: LogisticsTypeService,
        @Inject(TokenService) private readonly tokenService: TokenService,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
        @Inject(UuidUtil) private readonly uuidUtil: UuidUtil
    ) {
    }

    /**
     * 生成标签
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
        const config: LogisticConfigEntity = await this.typeService.findLogisticConfigByName('DHL');
        if (!config) {
            throw new HttpException('供应商配置信息不存在', 404);
        }
        const token: TokenEntity | undefined = await this.tokenService.findTokenByTypeName(config.logisticsProviderName);
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const params: DhlLabelReqBody[] = [];
        shipments.forEach((key, value) => {
            const labelReqBody: DhlLabelReqBody = {
                customerAccountId: undefined,
                pickupAccountId: config.PICKUPAccount,
                soldToAccountId: config.SOLDTOAccount,
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
        const body = {labelRequest: {hdr: header, bd: params}};
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