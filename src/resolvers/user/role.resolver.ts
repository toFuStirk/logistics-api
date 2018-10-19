import {Resolver, Mutation, Query } from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {RoleService} from '../../service/user/role.service';
let result;
@Resolver('role')
export class RoleResolver {
    constructor(@Inject(RoleService) private readonly roleService: RoleService) {}
    @Query('findRoles')
    async findRoles() {
        result = await this.roleService.findRoles();
        return result;
    }
    @Mutation('createRole')
    async createRole(obj, body: {name: string}) {
        result = await this.roleService.createRole(body.name);
        return result;
    }
    @Mutation('updateRole')
    async updateRole(obj, body: {id: number, name: string}) {
        result = await this.roleService.updateRole(body.id, body.name);
        return result;
    }
    @Mutation('deleteRole')
    async deleteRole(obj, body: {id: number}) {
        result = await this.roleService.deleteRole(body.id);
        return result;
    }
}