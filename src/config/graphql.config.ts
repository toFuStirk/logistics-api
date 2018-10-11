import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import * as GraphQLJSON from 'graphql-type-json';

@Injectable()
export class GraphqlConfig implements GqlOptionsFactory {
    constructor(
    ) {}
    createGqlOptions(): GqlModuleOptions {
        return {
            typePaths: ['./**/*.types.graphql'],
            resolvers: { JSON: GraphQLJSON },
         /*   context: async ({ req }) => {
                const user = await this.authService.validateUser(req);
                return {user};
            },*/
        };
    }
}