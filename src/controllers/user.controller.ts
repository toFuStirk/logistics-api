import {Body, Controller, Inject, Post, Req, Res} from '@nestjs/common';
import {UserService} from '../service/user/user.service';
import {RoleService} from '../service/user/role.service';
import {OrganizationService} from '../service/user/organization.service';
import {PagerUtil} from '../utils/pager.util';
import {CreateUserInput, UpdateUserInput, UserLoginLogInterface} from '../interfaces/user/user.interface';
import {Permission, Resource} from '../decorator';
import { InjectRepository } from '@nestjs/typeorm';
import {HttpUtil} from '../utils/http.util';
import {ApiConfigEntity} from '../model/user/api.config.entity';
import {Repository} from 'typeorm';
import {UserJDLocalInfoResBody} from '../interfaces/user/local.info.interface';
const useragent = require('useragent');
const api = require('./../config/user/api.config');
let result;
@Resource({name: '用户管理', identify: 'user'})
@Controller('user')
export class UserController {
    constructor(
        @InjectRepository(ApiConfigEntity) private apiRepo: Repository<ApiConfigEntity>,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(RoleService) private readonly roleService: RoleService,
        @Inject(OrganizationService) private readonly organizationService: OrganizationService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil
    ) {}
    @Permission({name: '创建用户', identify: 'user/createUser', action: 'create'})
    @Post('/createUser')
    async createUser(@Body() createUserInput: CreateUserInput, @Res() res) {
        const result = await this.userService.createUser(createUserInput);
        res.send(result);
        return;
    }
    /* 用户登录接口 */
    @Post('/login')
    async login(@Req() req, @Body() body: {userName: string, password: string}, @Res() res) {
        if (!body.userName || !body.password) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        const agent = useragent.parse(req.headers['user-agent']);
        const appkey = await this.apiRepo.findOne();
        const params = { appkey: appkey.jdapikey, ip: '117.34.35.1'};
        const local: UserJDLocalInfoResBody = await this.httpUtil.dhlGet(api.default.localInfoJD, params);
        const loginLog: UserLoginLogInterface = {
            loginIp: ip,
            action: '登录',
            loginLocal: local.code === '10000' ? `${local.result.data[0]}${local.result.data[1]}${local.result.data[2]}` : '',
            browser: agent.family,
            language: req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : '',
            isMobile: agent.isMobile ? '是' : '否',
            os: agent.os.family
        };
        const result = await this.userService.login(body.userName, body.password, loginLog);
        res.send(result);
        return;
    }
    @Permission({name: '删除用户', identify: 'user/deleteUser', action: 'delete'})
    @Post('/deleteUser')
    async deleteUser(@Body() body: {id: number},  @Res() res) {
        if (!body.id) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.deleteUser(body.id);
        res.send(result);
        return;
    }
    @Permission({name: '修改用户', identify: 'user/updateUserInfo', action: 'update'})
    @Post('/updateUserInfo')
    async updateUserInfo(@Body() body: {id: number, updateUserInput: UpdateUserInput}, @Res() res) {
        if (!body.id || !body.updateUserInput) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.updateUserInfo(body.id, body.updateUserInput);
        res.send(result);
        return;
    }
    @Permission({name: '查询所有用户', identify: 'user/findAllUser', action: 'find'})
    @Post('/findAllUser')
    async findAllUser(@Body() body: {pageSize: number, pageNumber: number, roleId: number, userName: string}, @Res() res) {
        if (!body.pageSize || !body.pageNumber) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        result = await this.userService.findAllUser(body.pageSize, body.pageNumber, body.roleId, body.userName);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Permission({name: '查询用户登录日志', identify: 'user/findUserLoginLogs', action: 'find'})
    @Post('/findUserLoginLogs')
    async findUserLoginLogs(@Body() body:
                                {pageNumber: number, pageSize: number, username: string, keywords?: string, startTime?: Date, endTime?: Date},
                            @Res() res) {
        if (!body.pageSize || !body.pageNumber) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        result = await this.userService.findUserLoginLogs(
            body.pageNumber, body.pageSize, body.username, body.keywords, body.startTime, body.endTime
        );
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
 }
