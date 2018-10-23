import {Resolver, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import {Inject, UseGuards} from '@nestjs/common';
import {UserService} from '../../service/user/user.service';
import {CreateUserInput, UpdateUserInput} from '../../interfaces/user/user.interface';
import {PagerUtil} from '../../utils/pager.util';
import {JwtAuthGuard} from '../../guards/user/jwt-auth.guard';
import {Permission, Resource} from '../../decorator';
let result;
@UseGuards(JwtAuthGuard)
@Resource({ name: '用户管理', identify: 'user:manage'})
@Resolver('user')
export class UserResolver {
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil,
    ) {}
    @Query('login')
    async login(obj, body: {userName: string, password: string}) {
        // result = await this.userService.login(body.userName, body.password);
        return result;
    }
    @Permission({name: '查询所有用户', identify: 'user:findAllUser', action: 'find' })
    @Query('findAllUser')
    async findAllUser(obj, body: {pageSize: number, pageNumber: number, roleId: number, userName: string}, context) {
        console.log('开始查找');
        result = await this.userService.findAllUser(body.pageSize, body.pageNumber, body.roleId, body.userName);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        return result;
    }
    @Query('findUserLoginLogs')
    async findUserLoginLogs(obj, body: {pageNumber: number, pageSize: number, username: string, keywords?: string, startTime?: Date, endTime?: Date}) {
        const {pageNumber, pageSize, username, keywords, startTime, endTime} = body;
        result = await this.userService.findUserLoginLogs(pageNumber, pageSize, username, keywords, new Date(startTime), new Date(endTime));
        result.pagination = await this.pagerUtil.getPager(result.totalItems, pageNumber, pageSize);
        return result;
    }
    @Mutation('createUser')
    async createUser(obj, body: {createUserInput: CreateUserInput}) {
        result = await this.userService.createUser(body.createUserInput);
        return result;
    }
    @Mutation('deleteUser')
    async deleteUser(obj, body: {id: number}) {
        await this.userService.deleteUser(body.id);
        return {code: 200, message: '删除成功'};
    }
    @Mutation('updateUserInfo')
    async updateUserInfo(obj, body: {id: number, updateUserInput: UpdateUserInput }) {
        result = await this.userService.updateUserInfo(body.id, body.updateUserInput);
        return result;
    }
    @Mutation('revertBannedOrRecycledUser')
    async revertBannedOrRecycledUser(body: {id: number, status: 'recycled' | 'banned'}) {
        result = await this.userService.revertBannedOrRecycledUser(body.id, body.status);
        return result;
    }
    @Mutation('recycleOrBanUser')
    async recycleOrBanUser(body: {id: number, action: 'recycle' | 'ban'}) {
        result = await this.userService.recycleOrBanUser(body.id, body.action);
        return result;
    }
}