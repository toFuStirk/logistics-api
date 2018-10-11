import {  Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfig } from './config/graphql.config';
import { PagerUtil } from './utils/pager.util';
import {HttpUtil} from "./utils/http.util";
import {TokenService} from "./service/dhl/token.service";
import {TokenResolver} from "./resolvers/dhl/token.resolver";
import {TokenEntity} from "./model/ahl/token.entity";

@Module({
    imports: [
        GraphQLModule.forRootAsync({useClass: GraphqlConfig}),
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([
           TokenEntity
        ])
    ],
    providers: [
      //  { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        PagerUtil,
        HttpUtil,
        TokenService,
        TokenResolver
    ],
    exports: []
})
export class AppModule {}
