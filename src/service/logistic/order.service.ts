import {HttpException, Inject, Injectable} from '@nestjs/common';
import {ShipmentItems} from '../../interfaces/logistic/dhl/dhl.label.req.body';
import {ReturnCodeInterface} from '../../interfaces/common/return.interface';
import {LabelShipmentEntity} from '../../model/logistic/shipment.entity';
import {UserDeliveryService} from './user.delivery.service';
import {UuidUtil} from '../../utils/uuid.util';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {ShipmentItemsEntity} from '../../model/logistic/shipment.items.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(LabelShipmentEntity) private readonly labelRepository: Repository<LabelShipmentEntity>,
        @InjectRepository(ShipmentItemsEntity) private readonly itemsRepository: Repository<ShipmentItemsEntity>,
        @Inject(UserDeliveryService) private readonly addressService: UserDeliveryService,
        @Inject(UuidUtil) private readonly uuidUtil: UuidUtil
    ) {}

    /**
     * 添加发货订单详情
     * @param userId
     * @param shipmentItems
     */
    async createShipmentOrder(userId: number, shipmentItems: ShipmentItems[]): Promise<number | ReturnCodeInterface> {
        const pickupAddress = await this.addressService.findOneDeliveryInformation(userId);
        if (!pickupAddress) return {code: 404, message: '当前用户没有配置发货信息'};
        try {
            for (const t in shipmentItems) {
                shipmentItems[t].shipmentNo = `MYBRU${await this.uuidUtil.uuids(14, 10)}`;
                // 判断shipmentId是否重复
                const count =  await this.itemsRepository.count({shipmentID: shipmentItems[t].shipmentID});
                if (count > 0) {
                    throw new HttpException(`shipmentId 不能重复`, 404);
                }
                const items: ShipmentItems = await this.itemsRepository.create(shipmentItems[t]);
                const labels: LabelShipmentEntity | undefined = await this.labelRepository.save(await this.labelRepository.create({
                    pickupAddress,
                    label: {
                        layout: '4x1',
                        pageSize: '14',
                        format: 'PNG'
                    },
                    shipperAddress: pickupAddress
                }));
                items.shipment = labels;
                await this.itemsRepository.save(items);
            }
        } catch (err) {
            throw new HttpException('数据库错误', 404);
        }
        return await this.findCountWithShipmentIds(shipmentItems.map((item) => item.shipmentID));
    }

    /**
     * 查看所有订单
     * @param pageNumber
     * @param pageSize
     */
    async findAllOrders(pageNumber: number, pageSize: number) {
        const result = await this.labelRepository.findAndCount({
            relations: ['shipmentItem'],
            order: { createDate: 'DESC'},
            skip: pageSize * (pageNumber - 1),
            take: pageSize
        });
        return {code: 200, message: '查找成功', orders: result[0], totalItems: result[1]};
    }

    /**
     * 查看订单添加成功数量
     * @param shipmentIds
     */
    async findCountWithShipmentIds(shipmentIds: string[]) {
        return await this.itemsRepository.count({shipmentID: In(shipmentIds)});
    }
}