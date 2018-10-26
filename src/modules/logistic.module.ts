import {Module, MulterModule, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TokenEntity} from '../model/logistic/token.entity';
import {LabelShipmentEntity} from '../model/logistic/shipment.entity';
import {ShipmentItemsEntity} from '../model/logistic/shipment.items.entity';
import {TokenService} from '../service/logistic/token.service';
import {TokenResolver} from '../resolvers/dhl/token.resolver';
import {LabelService} from '../service/dhl/label.service';
import {LabelResolver} from '../resolvers/dhl/label.resolver';
import {TrackingService} from '../service/dhl/tracking.service';
import {MetadataScanner} from '@nestjs/core/metadata-scanner';
import {PagerUtil} from '../utils/pager.util';
import {HttpUtil} from '../utils/http.util';
import {UuidUtil} from '../utils/uuid.util';
import {LogisticController} from '../controllers/logistic.controller';
import {MulterConfigService} from '../config/multer.config.service';
import {TrackingEntity} from '../model/logistic/tracking.entity';
import {TrackingItemsEntity} from '../model/logistic/tracking.items.entity';
import {LogisticConfigEntity} from '../model/logistic/logistic.config.entity';
import {ShippingService} from '../service/logistic/shipping.service';
import {ShippingManageEntity} from '../model/logistic/shipping.manage.entity';
import {UserDeliveryConfigEntity} from '../model/logistic/user_delivery.config.entity';
import {UserDeliveryService} from '../service/logistic/user.delivery.service';
import {LogisticsTypeService} from '../service/logistic/logistics.type.service';
import {OrderService} from '../service/logistic/order.service';

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService
        }),
        TypeOrmModule.forFeature([
            TokenEntity,
            TrackingEntity,
            TrackingItemsEntity,
            LabelShipmentEntity,
            ShipmentItemsEntity,
            LogisticConfigEntity,
            ShippingManageEntity,
            UserDeliveryConfigEntity,
        ])
    ],
    providers: [
        HttpUtil,
        UuidUtil,
        PagerUtil,
        OrderService,
        TokenService,
        TokenResolver,
        LabelService,
        LabelResolver,
        TrackingService,
        ShippingService,
        UserDeliveryService,
        LogisticsTypeService,
    ],
    controllers: [
        LogisticController
    ]
})
export class LogisticModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;
    constructor(private readonly tokenService: TokenService) {
        this.metadataScanner = new MetadataScanner();
    }
    onModuleInit() {
        // 定时任务设置为每天12点0分触发
        const schedule = require('node-schedule');
        //  每天12点定时刷新token
        const j = schedule.scheduleJob('0 0 0 */0 * *', function (y) {
            // 刷新token
            y.refreshToken('DHL');
        }.bind(undefined, this.tokenService));
        // j.cancel();
    }
}