import {Body, Controller, FileInterceptor, Get, Inject, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {LabelService} from '../service/dhl/label.service';
import {DhlLabelReqBody} from '../interfaces/dhl/dhl.label.req.body';
import {Permission, Resource} from '../decorator';
import {LogisticService} from '../service/dhl/logistic.service';
import {LogistisInterfaceInput} from '../interfaces/user/logistis.interface';
import {ShippingService} from "../service/dhl/shipping.service";
import {PagerUtil} from "../utils/pager.util";
const xlsx = require('xlsx');
let result;
@Resource({name: 'dhl物流管理', identify: 'dhl'})
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
   // @Permission({name: 'upload', identify: 'dhl:upload', action: 'find'})
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
    @Post('/createLogisticConfig')
    async createLogisticConfig(@Body() body: {createLogisticParams: LogistisInterfaceInput}, @Res() res) {
        if (!body.createLogisticParams.logisticsProviderName) {
            res.send({code: 404, message: '参数错误'});
            return;
        }
        result = await this.logisticService.createLogisticConfigEntity(body.createLogisticParams);
        res.send(result);
        return;
    }
    @Post('/updateLogisticConfigEntity')
    async updateLogisticConfigEntity(@Body() body: {updateLogisticParams: LogistisInterfaceInput}, @Res() res){
        if (!body.updateLogisticParams.id) {
            res.send({code: 404, message: '参数错误'});
            return;
        }
        result = await this.logisticService.updateLogisticConfigEntity(body.updateLogisticParams);
        res.send(result);
        return;
    }
    @Get('/findAllLogistics')
    async findAllLogistics(@Res() res) {
        result = await this.logisticService.findAllLogistics();
        res.send(result);
        return;
    }
    @Get('/findAllShippingInformation')
    async findAllShippingInformation(@Body() body: {pageNumber: number, pageSize: number, companyType: string, username: string}, @Res() res){
        result = await this.manageService.findAllShippingInformation(body.pageNumber, body.pageSize, body.companyType, body.username);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
}