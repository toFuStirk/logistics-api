import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Inject, Injectable } from '@nestjs/common';
import * as GraphQLJSON from 'graphql-type-json';
import {AuthService} from '../service/user/auth.service';

@Injectable()
export class GraphqlConfig implements GqlOptionsFactory {
    constructor(
       @Inject(AuthService) private readonly authService: AuthService
    ) {}
    createGqlOptions(): GqlModuleOptions {
        return {
            typePaths: ['./**/*.types.graphql'],
            resolvers: { JSON: GraphQLJSON },
            context: async ({ req }) => {
                const user = await this.authService.validateUser(req);
                req.user = user;
                return {user};
            },
        };
    }
}