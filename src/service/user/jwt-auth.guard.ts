import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const user = gqlCtx.getContext().user;
        if (!user || user.recycle || user.banned) {
            return false;
        }
        if (user && user.username === 'sadmin') {
            return true;
        }
        const userPerm = [];
        user && user.roles.forEach(role => {
            role.permissions.forEach(permission => {
                userPerm.push(permission.identify);
            });
        });
   /*     const handlerPerm = Reflect.getMetadata(decorators_1.PERMISSION_DEFINITION, context.getClass().prototype, context.getHandler().name);
        if (handlerPerm && !userPerm.includes(handlerPerm.identify)) {
            return false;
        }*/
        return true;
        //  const handlerPerm = Reflect.getMetadata(decorators.PERMISSION_DEFINITION, context.getClass().prototype, context.getHandler().name);
    }
    handleRequest(err, user, info) {
        console.log('进入handleRequest');
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

}