import {Module} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfig } from './config/graphql.config';
import {DhlModule} from './modules/dhl.module';
import {UserModule} from './modules/user.module';

@Module({
    imports: [
        GraphQLModule.forRootAsync({useClass: GraphqlConfig}),
        TypeOrmModule.forRoot(),
        DhlModule,
        UserModule.forRoot({
            authTokenWhiteList: ['login', 'getToken']
        })
    ],
    providers: [
      //  { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
        /*PagerUtil,
        HttpUtil,
        UuidUtil*/
    ],
    exports: []
})
export class AppModule {}
