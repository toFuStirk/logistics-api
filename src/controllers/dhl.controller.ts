import {
    Body,
    Controller,
    FileInterceptor,
    Get,
    Inject,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LabelService} from '../service/dhl/label.service';
import {DhlLabelReqBody} from '../interfaces/dhl/dhl.label.req.body';
import {Permission, Resource} from '../decorator';
import {LogisticService} from '../service/dhl/logistic.service';
import {LogisticsConfig, LogistisInterfaceInput} from '../interfaces/user/logistis.interface';
import {ShippingService} from '../service/dhl/shipping.service';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {PagerUtil} from '../utils/pager.util';
import {PermissionGuard} from '../guards/user/permission.guard';
import {PageParams} from "../interfaces/user/user.interface";
const xlsx = require('xlsx');
let result;
@Resource({name: '物流管理', identify: 'logistic:manage'})
@UseGuards(PermissionGuard)
@ApiUseTags('api/dhl')
@Controller('api/dhl')
export class DhlController {
    constructor (
        @Inject(LabelService) private readonly dhlLabelService: LabelService,
        @Inject(LogisticService) private readonly logisticService: LogisticService,
        @Inject(ShippingService) private readonly manageService: ShippingService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil
    ) {}
    // 上传文件
    @Post('/upload')
    @Permission({name: '文件上传', identify: 'dhl:upload', action: 'find'})
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        const result = [];
        const workbook = xlsx.readFile(file.path);
        workbook.SheetNames.forEach(function (sheetName) {
           const worksheet = workbook.Sheets[sheetName];
           result[sheetName] = xlsx.utils.sheet_to_json(worksheet);
        });
        // 解析完成之后， 插入数据库
        for (const t of result) {
            for (const h  of result[t]) {
                const lableAddress: DhlLabelReqBody = result[t][h];
                // 插入数据库， 并修改excels文件添加order 列
                await this.dhlLabelService.LabelTheDelivery(lableAddress);
            }
        }
        console.log('表信息如下', result);
        // 写入文件
      //  xlsx.writeFile(workbook, 'file');
    }
    @Permission({name: '创建物流配置项', identify: 'logistic:createLogisticConfig', action: 'create'})
    @ApiOperation({title: '创建物流配置项'})
    @Post('/createLogisticConfig')
    async createLogisticConfig(@Body() body: LogistisInterfaceInput, @Res() res) {
        if (!body.logisticsProviderName) {
            res.send({code: 404, message: '参数错误'});
            return;
        }
        result = await this.logisticService.createLogisticConfigEntity(body);
        res.send(result);
        return;
    }
    @Permission({name: '修改物流配置项', identify: 'logistic:updateLogisticConfigEntity', action: 'update'})
    @ApiOperation({title: '修改物流配置项'})
    @Post('/updateLogisticConfigEntity')
    async updateLogisticConfigEntity(@Body() body: LogistisInterfaceInput, @Res() res) {
        if (!body.id) {
            res.send({code: 404, message: '参数错误'});
            return;
        }
        result = await this.logisticService.updateLogisticConfigEntity(body);
        res.send(result);
        return;
    }
    @Get('/findAllLogistics')
    @ApiOperation({title: '查找所有配置项'})
    @Permission({name: '查找所有配置项', identify: 'logistic:findAllLogistics', action: 'find'})
    async findAllLogistics(@Res() res) {
        result = await this.logisticService.findAllLogistics();
        res.send(result);
        return;
    }
    @Get('/findAllShippingInformation')
    @ApiOperation({title: '查找发货记录'})
    @Permission({name: '查找发货记录', identify: 'logistic:findAllShippingInformation', action: 'find'})
    async findAllShippingInformation(@Body() body: LogisticsConfig, @Res() res) {
        result = await this.manageService.findAllShippingInformation(body.pageNumber, body.pageSize, body.companyType, body.username);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Get('/findAllOrders')
    @ApiOperation({title: '查找所有订单'})
    @Permission({name: '查找所有订单', identify: 'logistic:findAllOrders', action: 'find'})
    async findAllOrders(@Body() body: PageParams, @Res() res) {
        result = await this.dhlLabelService.findAllLabels(body.pageNumber, body.pageSize);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
}