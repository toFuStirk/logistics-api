import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ShippingManageEntity} from '../../model/dhl/shipping.manage.entity';
import {Repository} from 'typeorm';
import {DhlShippingManageInterface} from '../../interfaces/dhl/dhl.shipping.manage';
@Injectable()
export class ShippingService {
    constructor(
        @InjectRepository(ShippingManageEntity) private readonly manageRepo: Repository<ShippingManageEntity>,
    ) {}
    /* 创建发货记录 */
    async createShippingManageEntity(createShippingInput: DhlShippingManageInterface) {
        await this.manageRepo.save(this.manageRepo.create(createShippingInput));
    }
    /* 查找所有发货记录 */
    async findAllShippingInformation(pageNumber: number, pageSize: number, companyType: string, username: string) {
        const shippings = await this.manageRepo.findAndCount({
            where: {
                companyType: `%${companyType ? companyType : ''}%`,
                username: `%${username ? username : ''}%`
            },
            order: {
                createAt: 'DESC'
            },
            skip: pageSize * (pageNumber - 1),
            take: pageSize
        });
        return {code: 200, message: '查找成功', shippings: shippings[0], totalItems: shippings[1]};
    }
}