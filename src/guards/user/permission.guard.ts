import {CanActivate, Inject} from '@nestjs/common';
import {ExecutionContextHost} from '@nestjs/core/helpers/execution-context.host';
import {User} from '../../model/user/users.entity';
import {PermissionEntity} from '../../model/user/permission.entity';
import {PERMISSION_DEFINITION} from '../../decorator/index';
import {UserService} from '../../service/user/user.service';

export class PermissionGuard implements CanActivate {
    constructor(@Inject(UserService) private readonly userService: UserService) {}
    async canActivate(context: ExecutionContextHost): Promise<boolean> {
        const parent = context.getClass();
        const handler = context.getHandler();
        const result: User = context.switchToHttp().getRequest().user as User;
        const  user =  await this.userService.findOneWithRolesAndPermissions(result.username);
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
        const handlerPerm = <PermissionEntity>Reflect.getMetadata(PERMISSION_DEFINITION, parent.prototype, handler.name);
        if (handlerPerm && !userPerm.includes(handlerPerm.identify)) {
            return false;
        }
        return true;
    }
}