import {
    Body,
    Controller, Get,
    Inject,
    Param,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {UserService} from '../service/user/user.service';
import {RoleService} from '../service/user/role.service';
import {OrganizationService} from '../service/user/organization.service';
import {PagerUtil} from '../utils/pager.util';
import {
    CreateUserInput, FindAllUser,
    UpdateUserInput,
    UserLogin,
    UserLoginLogInterface, UserLogs
} from '../interfaces/user/user.interface';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {Permission, Resource} from '../decorator';
import { InjectRepository } from '@nestjs/typeorm';
import {HttpUtil} from '../utils/http.util';
import {ApiConfigEntity} from '../model/user/api.config.entity';
import {Repository} from 'typeorm';
import {UserJDLocalInfoResBody} from '../interfaces/user/local.info.interface';
import {PermissionGuard} from '../guards/user/permission.guard';
const useragent = require('useragent');
const api = require('./../config/user/api.config');
let result;
@Resource({name: '用户管理', identify: 'user'})
@UseGuards(PermissionGuard)
@ApiUseTags('api/user')
@Controller('api/user')
export class UserController {
    constructor(
        @InjectRepository(ApiConfigEntity) private apiRepo: Repository<ApiConfigEntity>,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(RoleService) private readonly roleService: RoleService,
        @Inject(OrganizationService) private readonly organizationService: OrganizationService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil
    ) {}
    @Permission({name: '创建用户', identify: 'user:createUser', action: 'create'})
    @Post('/createUser')
    @ApiOperation({title: '创建用户'})
    async createUser(@Req() req, @Body() createUserInput: CreateUserInput, @Res() res) {
        const result = await this.userService.createUser(createUserInput);
        res.send(result);
        return;
    }
    /* 用户登录接口 */
    @Post('/login')
    @ApiOperation({title: '用户登录'})
    async login(@Req() req, @Body() userLogin: UserLogin, @Res() res) {
        if (!userLogin.username || !userLogin.password) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress)
            .replace('::ffff:', '');
        const agent = useragent.parse(req.headers['user-agent']);
        const appkey = await this.apiRepo.findOne();
        const params = { appkey: appkey.jdapikey, ip};
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
        result = await this.userService.login(userLogin.username, userLogin.password, loginLog);
        res.send(result);
        return;
    }
    @Permission({name: '删除用户', identify: 'user:deleteUser', action: 'delete'})
    @ApiOperation({title: '删除用户'})
    @Post('/deleteUser')
    async deleteUser(@Param('id') id: number, @Res() res) {
        if (!id) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.deleteUser(id);
        res.send(result);
        return;
    }
    @Permission({name: '修改用户', identify: 'user:updateUserInfo', action: 'update'})
    @ApiOperation({title: '修改用户'})
    @Post('/updateUserInfo')
    async updateUserInfo(@Body()  updateUserInput: UpdateUserInput, @Res() res) {
        if (!updateUserInput.id) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.updateUserInfo(updateUserInput.id, updateUserInput);
        res.send(result);
        return;
    }
    @Permission({name: '查询所有用户', identify: 'user:findAllUser', action: 'find'})
    @ApiOperation({title: '查询所有用户'})
    @Post('/findAllUser')
    async findAllUser(@Body() body: FindAllUser, @Res() res) {
        if (!body.pageSize || !body.pageNumber) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        result = await this.userService.findAllUser(body.pageSize, body.pageNumber, body.roleId, body.userName);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Permission({name: '查询用户登录日志', identify: 'user:findUserLoginLogs', action: 'find'})
    @ApiOperation({title: '查询用户登录日志'})
    @Post('/findUserLoginLogs')
    async findUserLoginLogs(@Req() req, @Body() body: UserLogs, @Res() res) {
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
    @Permission({name: '获取所有用户角色', identify: 'user:findAllRoles', action: 'find'})
    @ApiOperation({title: '获取所有用户角色'})
    @Get('/findAllRoles')
    async findAllRoles(@Res() res) {
        result = await this.roleService.findRoles();
        res.send(result);
        return;
    }
    @Permission({name: '获取所有用户组织', identify: 'user:findAllOrganizations', action: 'find'})
    @ApiOperation({title: '获取所有用户组织'})
    @Get('/findAllOrganizations')
    async findAllOrganizations(@Res() res) {
        result = await this.organizationService.findAllTrees();
        res.send({code: 200, message: '获取成功', organizations: result});
        return;
    }
 }
