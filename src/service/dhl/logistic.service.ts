import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LogisticConfigEntity} from '../../model/dhl/logistic.config.entity';
import {Not, Repository} from 'typeorm';
import {LogistisInterfaceInput} from '../../interfaces/user/logistis.interface';

@Injectable()
export class LogisticService {
    constructor(
        @InjectRepository(LogisticConfigEntity) private logisticRepo: Repository<LogisticConfigEntity>,
    ) {}
    /* 创建物流供应商基本信息 */
    async createLogisticConfigEntity(createLogisticInput: LogistisInterfaceInput) {
        const logistic = await this.logisticRepo.count({
            logisticsProviderName: createLogisticInput.logisticsProviderName
        });
        if (logistic > 0) {
            return {code: 404, message: '物流供应商名称不能重复'};
        }
        try {
            await this.logisticRepo.save(this.logisticRepo.create(createLogisticInput));
        } catch (err) {
            throw new HttpException('数据库错误', 404);
        }
        return {code: 200, message: '创建成功'};
    }
    /* 修改物流供应商基本信息 */
    async updateLogisticConfigEntity(updateLogisticInput: LogistisInterfaceInput) {
        const  logistic = await this.logisticRepo.findOne(updateLogisticInput.id);
        if (!logistic) {
            return {code: 404, message: '当前物流供应商不存在'};
        }
        const count = await this.logisticRepo.count({
            id: Not(updateLogisticInput.id),
            logisticsProviderName: updateLogisticInput.logisticsProviderName
        });
        if (count > 0) {
            return {code: 404, message: '物流供应商名称不能重复'};
        }
        try {
            await this.logisticRepo.save(updateLogisticInput);
        } catch (err) {
            throw new HttpException('数据库错误', err);
        }
        return {code: 200, message: '修改成功'};
    }
    /* 查找所有物流供应商信息 */
    async findAllLogistics(logisticsProviderName?: string) {
        const logistics = await this.logisticRepo.find({
            logisticsProviderName: `%${logisticsProviderName ? logisticsProviderName : ''}%`
        });
        return {code: 200, message: '查找成功', logistics};
    }
}