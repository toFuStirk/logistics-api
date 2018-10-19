import {Module, MulterModule, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TokenEntity} from '../model/dhl/token.entity';
import {ShipmentEntity} from '../model/dhl/shipment.entity';
import {ShipmentItemsEntity} from '../model/dhl/shipment.items.entity';
import {TokenService} from '../service/dhl/token.service';
import {TokenResolver} from '../resolvers/dhl/token.resolver';
import {LabelService} from '../service/dhl/label.service';
import {LabelResolver} from '../resolvers/dhl/label.resolver';
import {TrackingService} from '../service/dhl/tracking.service';
import {MetadataScanner} from '@nestjs/core/metadata-scanner';
import {PagerUtil} from '../utils/pager.util';
import {HttpUtil} from '../utils/http.util';
import {UuidUtil} from '../utils/uuid.util';
import {DhlController} from '../controllers/dhl.controller';
import {MulterConfigService} from '../config/multer.config.service';
import {TrackingEntity} from '../model/dhl/tracking.entity';
import {TrackingItemsEntity} from '../model/dhl/tracking.items.entity';

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService
        }),
        TypeOrmModule.forFeature([
            TrackingItemsEntity,
            TokenEntity,
            ShipmentEntity,
            ShipmentItemsEntity,
            TrackingEntity
        ])
    ],
    providers: [
        PagerUtil,
        HttpUtil,
        UuidUtil,
        TokenService,
        TokenResolver,
        LabelService,
        LabelResolver,
        TrackingService
    ],
    controllers: [
        DhlController
    ]
})
export class DhlModule implements OnModuleInit {
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
            y.refreshToken();
        }.bind(undefined, this.tokenService));
        // j.cancel();
    }
}