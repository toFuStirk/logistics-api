import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ShippingManageEntity} from '../../model/logistic/shipping.manage.entity';
import {Not, Repository} from 'typeorm';
import {ShippingManageInterface} from '../../interfaces/logistic/shipping.manage';
@Injectable()
export class ShippingService {
    constructor(
        @InjectRepository(ShippingManageEntity) private readonly manageRepo: Repository<ShippingManageEntity>,
    ) {}

    /**
     * 添加发货记录
     * @param createShippingInput
     */
    async createShippingManageEntity(createShippingInput: ShippingManageInterface) {
        await this.manageRepo.save(this.manageRepo.create(createShippingInput));
    }

    /**
     * 查找所有发货记录
     * @param pageNumber
     * @param pageSize
     * @param companyType
     * @param username
     * @param userId
     */
    async findAllShippingInformation(pageNumber: number, pageSize: number, companyType: string, username: string, userId ?: number) {
        const records = await this.manageRepo.findAndCount({
            where: {
                companyType: `%${companyType ? companyType : ''}%`,
                username: `%${username ? username : ''}%`,
                userId: userId ? userId : Not(undefined)
            },
            order: {
                createAt: 'DESC'
            },
            skip: pageSize * (pageNumber - 1),
            take: pageSize
        });
        return {code: 200, message: '查找成功', records: records[0], totalItems: records[1]};
    }
}