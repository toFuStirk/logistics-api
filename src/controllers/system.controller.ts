import {Body, Controller, Get, Inject, Param, Post, Res, UseGuards} from '@nestjs/common';
import {SystemService} from '../service/system/system.service';
import {CreatePlatformInterface, ExchangeRateInterface} from '../interfaces/system/system.interface';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {Permission, Resource} from '../decorator';
import {PermissionGuard} from '../guards/user/permission.guard';
let result;
@Resource({name: '系统设置', identify: 'system'})
@UseGuards(PermissionGuard)
@ApiUseTags('api/system')
@Controller('api/system')
export class SystemController {
    constructor(
        @Inject(SystemService) private readonly systemService: SystemService
    ) {}
    @Post('/createPlatform')
    @ApiOperation({title: '创建管理平台'})
    @Permission({name: '创建管理平台', identify: 'system:createPlatform ', action: 'create'})
    async createPlatform(@Body() body: CreatePlatformInterface, @Res() res) {
        result = await this.systemService.createPlatformEntity(body);
        res.send(result);
        return;
    }
    @Post('/updatePlatform')
    @ApiOperation({title: '修改管理平台'})
    @Permission({name: '修改管理平台', identify: 'system:updatePlatform ', action: 'update'})
    async updatePlatform(@Body() body: CreatePlatformInterface, @Res() res) {
        if (!body.id) return res.send({code: 404, message: '参数错误'});
        result = await this.systemService.updatePlatformEntity(body);
        res.send(result);
        return;
    }
    @Get('/findPlatform')
    @ApiOperation({title: '获取管理平台'})
    @Permission({name: '获取管理平台', identify: 'system:findPlatform ', action: 'find'})
    async findPlatform(@Res() res) {
        result = await this.systemService.findPlatformEntity();
        res.send(result);
        return;
    }
    @Post('/createExchangeRate')
    @ApiOperation({title: '创建汇率'})
    @Permission({name: '创建汇率', identify: 'system:createExchangeRate ', action: 'create'})
    async createExchangeRate(@Body() body:  ExchangeRateInterface, @Res() res) {
        result = await this.systemService.createExchangeRateEntity(body);
        res.send(result);
        return;
    }
    @Post('/updateExchangeRate')
    @ApiOperation({title: '修改汇率'})
    @Permission({name: '修改汇率', identify: 'system:updateExchangeRate ', action: 'update'})
    async updateExchangeRate(@Body() body:  ExchangeRateInterface, @Res() res) {
        result = await this.systemService.updateExchangeRateEntity(body);
        res.send(result);
        return;
    }
    @Post('/findAllRates')
    @ApiOperation({title: '查找所有汇率'})
    @Permission({name: '查找所有汇率', identify: 'system:findAllRates ', action: 'find'})
    async findAllRates(@Param('currencyName') currencyName: string, @Res() res) {
        result = await this.systemService.findAllRates(currencyName);
        res.send(result);
        return;
    }
}