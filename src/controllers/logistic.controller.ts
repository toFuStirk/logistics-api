import {
    Body,
    Controller,
    FileInterceptor,
    Get,
    Inject,
    Post, Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ShipmentItems} from '../interfaces/logistic/dhl/dhl.label.req.body';
import {Permission, Resource} from '../decorator';
import {LogisticsConfig, LogistisInterfaceInput} from '../interfaces/user/logistis.interface';
import {ShippingService} from '../service/logistic/shipping.service';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {PagerUtil} from '../utils/pager.util';
import {PermissionGuard} from '../guards/user/permission.guard';
import {PageParams} from '../interfaces/user/user.interface';
import {DeliveryParams, DeliveryParamUserId, DhlDeliveryReqBody} from '../interfaces/logistic/dhl/dhl.delivery.req.body';
import {UserDeliveryService} from '../service/logistic/user.delivery.service';
import {LogisticsTypeService} from '../service/logistic/logistics.type.service';
import {OrderService} from '../service/logistic/order.service';
const xlsx = require('xlsx');
let result;
@Resource({name: '物流管理', identify: 'logistic:manage'})
@UseGuards(PermissionGuard)
@ApiUseTags('api/logistic')
@Controller('api/logistic')
export class LogisticController {
    constructor (
        @Inject(OrderService) private readonly orderService: OrderService,
        @Inject(LogisticsTypeService) private readonly logisticService: LogisticsTypeService,
        @Inject(ShippingService) private readonly manageService: ShippingService,
        @Inject(UserDeliveryService) private readonly deliveryService: UserDeliveryService,
        @Inject(PagerUtil) private readonly pagerUtil: PagerUtil
    ) {}
    // 上传文件
    @Post('/upload')
    @Permission({name: '文件上传', identify: 'logistic:upload', action: 'find'})
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Req() req, @UploadedFile() file) {
        const result = [];
        const arrays: ShipmentItems[] = [];
        const workbook = xlsx.readFile(file.path);
        workbook.SheetNames.forEach(function (sheetName) {
           const worksheet = workbook.Sheets[sheetName];
           result[sheetName] = xlsx.utils.sheet_to_json(worksheet);
           result[sheetName].forEach((sheet) => {
               let map = new Map();
               map = objToStrMap(sheet);
               const items: ShipmentItems = {
                   id: undefined,
                   shipmentID: map.get('Shipment Order ID'),
                   packageDesc: map.get('Shipment Description'),
                   productCode: map.get('Shipping Service Code'),
                   consigneeAddress: {
                       name: map.get('Consignee Name'),
                       address1: map.get('Address Line 1'),
                       city: map.get('City'),
                       state: map.get('State'),
                       postCode: map.get('Postal Code'),
                       country: map.get('Destination Country Code'),
                       phone: map.get('Phone Number')
                   },
                   totalWeight: map.get('Shipment Weight (g)'),
                   totalWeightUOM: 'g',
                   currency: map.get('Currency Code'),
                   totalValue: map.get('Total Declared Value'),
                   codValue: map.get('Is COD') && map.get('Is COD') === 'Y' ? map.get('Cash on Delivery Value') : undefined,
                   shipmentNo: undefined
               };
               arrays.push(items);
           });
        });
        const count = await this.orderService.createShipmentOrder(req.user.id, arrays);
        await this.manageService.createShippingManageEntity({
            userId: req.user.id,
            username: req.user.name,
            companyType: 'DHL',
            uploadNumber: count && count.toString().includes('code') ? 0 : Number(count)
        });
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
    async findAllShippingInformation(@Req() req, @Body() body: LogisticsConfig, @Res() res) {
        let userId;
        if (!body.username || req.user.roles.map((role) => role.id).includes(1, 2)) {
            userId = req.user.id;
        }
        result = await this.manageService.findAllShippingInformation(body.pageNumber, body.pageSize, body.companyType, body.username, userId);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Post('/findAllOrders')
    @ApiOperation({title: '查找所有订单'})
    @Permission({name: '查找所有订单', identify: 'logistic:findAllOrders', action: 'find'})
    async findAllOrders(@Body() body: PageParams, @Res() res) {
        result = await this.orderService.findAllOrders(body.pageNumber, body.pageSize);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Permission({name: '用户配置发货人信息', identify: 'logistic:createUserDeliveryInformation', action: 'create'})
    @ApiOperation({title: '用户配置发货人信息'})
    @Post('/createUserDeliveryInformation')
    async createUserDeliveryInformation(@Req() req, @Body() body: DhlDeliveryReqBody, @Res() res) {
        body.userId = req.user.id;
        result = await this.deliveryService.createUserDeliveryInformation(body);
        res.send(result);
        return result;
    }
    @Permission({name: '修改用户配置的发货人信息', identify: 'logistic:updateUserDeliveryInformation', action: 'update'})
    @ApiOperation({title: '修改用户配置的发货人信息'})
    @Post('/updateUserDeliveryInformation')
    async updateUserDeliveryInformation(@Body() body: DhlDeliveryReqBody, @Res() res) {
        result = await this.deliveryService.updateUserDeliveryInformation(body);
        res.send(result);
        return;
    }
    @Permission({name: '获取所有用户配置的发货人信息', identify: 'logistic:findAllDeliveryInformation', action: 'find'})
    @ApiOperation({title: '获取所有用户配置的发货人信息'})
    @Get('/findAllDeliveryInformation')
    async findAllDeliveryInformation(@Body() body: DeliveryParams, @Res() res) {
        result = await this.deliveryService.findAllDeliveryInformation(body.pageNumber, body.pageSize, body.username);
        result.pagination = await this.pagerUtil.getPager(result.totalItems, body.pageNumber, body.pageSize);
        res.send(result);
        return;
    }
    @Permission({name: '获取当前或指定用户配置的发货人信息', identify: 'logistic:findOneDeliveryInformation', action: 'find'})
    @ApiOperation({title: '获取当前或指定用户配置的发货人信息'})
    @Get('/findOneDeliveryInformation')
    async findOneDeliveryInformation(@Req() req,  @Body() body: DeliveryParamUserId, @Res() res) {
       result = await this.deliveryService.findOneDeliveryInformation(body ? body : req.user.userId);
       result.code = 200;
       result.message = '查找成功';
       res.send(result);
       return;
    }
    @Permission({name: '删除用户配置发货人信息', identify: 'logistic:deleteDeliveryInformation', action: 'delete'})
    @ApiOperation({title: '删除用户配置发货人信息'})
    @Post('/deleteDeliveryInformation')
    async deleteDeliveryInformation(@Req() req, @Body() body: DeliveryParamUserId, @Res() res) {
        result = await this.deliveryService.deleteDeliveryInformation(body ? body : req.user.userId);
        res.send(result);
        return;
    }
}
function objToStrMap(obj): Map<string, string> {
    const strMap = new Map();
    if (obj) {
        for (const k of Object.keys(obj)) {
            strMap.set(k, obj[ k ]);
        }
    }
    return strMap;
}