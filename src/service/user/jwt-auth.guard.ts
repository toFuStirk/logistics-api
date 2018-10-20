import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const user = gqlCtx.getContext().user;
        if (user && user.username === 'sadmin') {
            await this.handleRequest(undefined, user, undefined);
            return;
        }
        if (user && !user.id) {
            return true;
        }
        if (user && user.id) {
            const userPerm = [];
            user && user.roles.forEach(role => {
                role.permissions.forEach(permission => {
                    userPerm.push(permission.identify);
                });
            });
        }
        return await this.handleRequest(undefined, user, undefined);
        //  const handlerPerm = Reflect.getMetadata(decorators.PERMISSION_DEFINITION, context.getClass().prototype, context.getHandler().name);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

}