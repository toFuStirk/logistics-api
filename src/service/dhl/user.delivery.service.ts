import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {HttpException, Inject, Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {ReturnCodeInterface} from '../../interfaces/common/return.interface';
import {DhlDeliveryReqBody} from '../../interfaces/dhl/dhl.delivery.req.body';
import {UserDeliveryConfigEntity} from '../../model/dhl/user_delivery.config.entity';


@Injectable()
export class UserDeliveryService {
    constructor(
        @InjectRepository(UserDeliveryConfigEntity) private readonly deliveryRepo: Repository<UserDeliveryConfigEntity>,
        @Inject(UserService) private readonly userService: UserService
    ) {}
    /* 创建物流发货信息 */
    async createUserDeliveryInformation(createDeliveryInfo: DhlDeliveryReqBody): Promise<ReturnCodeInterface> {
        const userInformationCount = await this.deliveryRepo.count({userId: createDeliveryInfo.userId});
        if (userInformationCount > 0) {
            return {code: 404, message: '当前用户已有物流发货信息'};
        }
        try {
            await this.deliveryRepo.save(this.deliveryRepo.create(createDeliveryInfo));
        } catch (err) {
            throw new HttpException('数据库错误', 404);
        }
        return {code: 200, message: '创建成功'};
    }
    /* 修改物流发货信息 */
    async updateUserDeliveryInformation(updateDeliveryInfo: DhlDeliveryReqBody): Promise<ReturnCodeInterface> {
        const userInformation = await this.deliveryRepo.findOne(updateDeliveryInfo.userId);
        if (!userInformation) {
            return {code: 404, message: '当前用户没有物流发货信息'};
        }
        try {
            await this.deliveryRepo.update({userId: updateDeliveryInfo.userId}, updateDeliveryInfo);
        } catch (err) {
            throw new HttpException('数据库错误', 404);
        }
        return {code: 200, message: '修改成功'};
    }
    /* 查找所有物流发货信息 */
    async findAllDeliveryInformation(pageNumber: number, pageSize: number, username: string) {
        const user = await this.userService.findOneWithRolesAndPermissions(username);
        const result = await this.deliveryRepo.findAndCount({
            where: {
                userId: user.id
            },
            skip: pageSize * (pageNumber - 1),
            take: pageSize
        });
        return {code: 200, message: '查找成功', deliveries: result[0], totalItems: result[1]};
    }
    /* 查找指定用户物流发货信息 */
    async findOneDeliveryInformation(userId: number) {
        return await this.deliveryRepo.findOne({userId});
    }
    /* 删除指定用户物流发货信息 */
    async deleteDeliveryInformation(userId: number): Promise<ReturnCodeInterface> {
        const userInformation = await this.deliveryRepo.findOne({userId});
        if (!userInformation) {
            return {code: 404, message: '当前用户没有物流发货信息'};
        }
        try {
            await this.deliveryRepo.delete({userId});
        } catch (err) {
            throw new HttpException('数据库错误', 404);
        }
        return {code: 200, message: '删除成功'};
    }
}