import {Module} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfig } from './config/graphql.config';
import { PagerUtil } from './utils/pager.util';
import {HttpUtil} from './utils/http.util';
import {UuidUtil} from './utils/uuid.util';
import {DhlModule} from './modules/dhl.module';

@Module({
    imports: [
        GraphQLModule.forRootAsync({useClass: GraphqlConfig}),
        TypeOrmModule.forRoot(),
        DhlModule,
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
