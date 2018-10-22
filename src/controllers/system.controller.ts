import {Body, Controller, Get, Inject, Post, Res} from '@nestjs/common';
import {SystemService} from '../service/system/system.service';
import {CreatePlatformInterface, ExchangeRateInterface} from '../interfaces/system/system.interface';
import {Permission, Resource} from '../decorator';
let result;
@Resource({name: '系统设置', identify: 'system'})
@Controller('system')
export class SystemController {
    constructor(
        @Inject(SystemService) private readonly systemService: SystemService
    ) {}
    @Post('/createPlatform')
    @Permission({name: '创建管理平台', identify: 'system:createPlatform ', action: 'create'})
    async createPlatform(@Body() body: {platform: CreatePlatformInterface}, @Res() res) {
        result = await this.systemService.createPlatformEntity(body.platform);
        res.send(result);
        return;
    }
    @Post('/updatePlatform')
    @Permission({name: '修改管理平台', identify: 'system:updatePlatform ', action: 'update'})
    async updatePlatform(@Body() body: {platform: CreatePlatformInterface}, @Res() res) {
        if (!body.platform.id) return res.send({code: 404, message: '参数错误'});
        result = await this.systemService.updatePlatformEntity(body.platform);
        res.send(result);
        return;
    }
    @Get('/findPlatform')
    @Permission({name: '获取管理平台', identify: 'system:findPlatform ', action: 'find'})
    async findPlatform(@Res() res) {
        result = await this.systemService.findPlatformEntity();
        res.send(result);
        return;
    }
    @Post('/createExchangeRate')
    async createExchangeRate(@Body() body: {createExchangeRate: ExchangeRateInterface}, @Res() res){
        result = await this.systemService.createExchangeRateEntity(body.createExchangeRate);
        res.send(result);
        return;
    }
    @Post('/updateExchangeRate')
    async updateExchangeRate(@Body() body: {updateExchangeRate: ExchangeRateInterface}, @Res() res) {
        result = await this.systemService.updateExchangeRateEntity(body.updateExchangeRate);
        res.send(result);
        return;
    }
    @Post('/findAllRates')
    async findAllRates(@Body() body: {currencyName: string}, @Res() res) {
        result = await this.systemService.findAllRates(body.currencyName);
        res.send(result);
        return;
    }
}