import {  Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfig } from './config/graphql.config';
import { PagerUtil } from './utils/pager.util';
import {HttpUtil} from './utils/http.util';
import {TokenService} from './service/dhl/token.service';
import {TokenResolver} from './resolvers/dhl/token.resolver';
import {TokenEntity} from './model/dhl/token.entity';
import {LabelService} from './service/dhl/label.service';
import {LabelResolver} from './resolvers/dhl/label.resolver';
import {TrackingService} from './service/dhl/tracking.service';
import {ShipmentEntity} from './model/dhl/shipment.entity';
import {ShipmentItemsEntity} from "./model/dhl/shipment.items.entity";
import {UuidUtil} from "./utils/uuid.util";

@Module({
    imports: [
        GraphQLModule.forRootAsync({useClass: GraphqlConfig}),
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([
           TokenEntity,
           ShipmentEntity,
           ShipmentItemsEntity
        ])
    ],
    providers: [
      //  { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        PagerUtil,
        HttpUtil,
        UuidUtil,
        TokenService,
        TokenResolver,
        LabelService,
        LabelResolver,
        TrackingService
    ],
    exports: []
})
export class AppModule {}
