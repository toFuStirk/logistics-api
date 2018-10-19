import {Resolver, Mutation, Query } from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {OrganizationService} from '../../service/user/organization.service';
let result;
@Resolver('organization')
export class OrganizationResolver {
    constructor(
        @Inject(OrganizationService) private readonly organizationService: OrganizationService
    ) {}
    @Query('findRoots')
    async findRoots() {
        result = await this.organizationService.findRoots();
    }
    @Query('findAllTrees')
    async findAllTrees() {
        result = await this.organizationService.findAllTrees();
    }
    @Query('findChildren')
    async findChildren(obj, body: {id: number}) {
        result = await this.organizationService.findChildren(body.id);
        return result;
    }
    @Mutation('createOrganization')
    async createOrganization(obj, body: {name: string, parentId: number}) {
        result = await this.organizationService.createOrganization(body.name, body.parentId);
        return result;
    }
    @Mutation('updateOrganization')
    async updateOrganization(obj, body: {id: number, name: string, parentId: number}) {
        result = await this.organizationService.updateOrganization(body.id, body.name, body.parentId);
        return result;
    }
    @Mutation('deleteOrganization')
    async deleteOrganization(obj, body: {id: number}) {
        result = await this.organizationService.deleteOrganization(body.id);
        return result;
    }
    @Mutation('addUsersToOrganization')
    async addUsersToOrganization(obj, body: {id: number, userIds: number[]}) {
        result = await this.organizationService.addUsersToOrganization(body.id, body.userIds);
        return result;
    }
    @Mutation('deleteUserFromOrganization')
    async deleteUserFromOrganization(obj, body: {id: number, userIds: number[]}) {
        result = await this.organizationService.deleteUserFromOrganization(body.id, body.userIds);
        return result;
    }

}