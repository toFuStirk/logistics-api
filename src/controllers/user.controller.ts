import {Body, Controller, Inject, Post, Res} from '@nestjs/common';
import {UserService} from '../service/user/user.service';
import {RoleService} from '../service/user/role.service';
import {OrganizationService} from '../service/user/organization.service';
import {PagerUtil} from '../utils/pager.util';
import {CreateUserInput, UpdateUserInput} from '../interfaces/user/user.interface';
@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @Inject(RoleService) private readonly roleService: RoleService,
        @Inject(OrganizationService) private readonly organizationService: OrganizationService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil
    ) {}
    @Post('/createUser')
    async createUser(@Body() createUserInput: CreateUserInput, @Res() res) {
        const result = await this.userService.createUser(createUserInput);
        res.send(result);
        return;
    }
    @Post('/login')
    async login(@Body() body: {userName: string, password: string}, @Res() res) {
        if (!body.userName || !body.password) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.login(body.userName, body.password);
        res.send(result);
        return;
    }
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
    @Post('/findAllUser')
    async findAllUser(@Body() body: {pageSize: number, pageNumber: number, roleId: number, userName: string}, @Res() res) {
        if (!body.pageSize || !body.pageNumber) {
            res.send({code: 405, message: '参数不正确'});
            return;
        }
        const result = await this.userService.findAllUser(body.pageSize, body.pageNumber, body.roleId, body.userName);
        res.send(result);
        return;
    }
 }
