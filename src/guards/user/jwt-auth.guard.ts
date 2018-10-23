import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {PermissionEntity} from '../../model/user/permission.entity';
import { PERMISSION_DEFINITION } from '../../decorator/index';
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
        const userPerm: string[] = [];
        if (user && user.roles.length) {
            user.roles.forEach(role => {
                if (role.permissions && role.permissions.length) {
                    role.permissions.forEach(permission => {
                        userPerm.push(permission.identify);
                    });
                }
            });
        }
        console.log('prototype', context.getClass().prototype);
        console.log('name', context.getHandler().name);
        const handlerPerm = <PermissionEntity>Reflect.getMetadata(PERMISSION_DEFINITION, context.getClass().prototype, context.getHandler().name);
        console.log('handlerPerm', handlerPerm);
        if (handlerPerm && !userPerm.includes(handlerPerm.identify)) {
            return false;
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