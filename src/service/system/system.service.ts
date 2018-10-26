import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PlatformEntity} from '../../model/system/platform.entity';
import {Not, Repository} from 'typeorm';
import {CreatePlatformInterface, ExchangeRateInterface} from '../../interfaces/system/system.interface';
import {ExchangeRateEntity} from '../../model/system/exchange_rate.entity';

@Injectable()
export class SystemService {
    constructor(
        @InjectRepository(PlatformEntity) private readonly platformRepo: Repository<PlatformEntity>,
        @InjectRepository(ExchangeRateEntity) private readonly rateRepo: Repository<ExchangeRateEntity>
    ) {}

    /**
     * 添加系统设置
     * @param createPlatform
     */
    async createPlatformEntity(createPlatform: CreatePlatformInterface) {
        if (createPlatform.allowUserLogin && createPlatform.promptInformation) {
            return {code: 404, message: '允许用户登录不能添加提示信息'};
        }
        try {
            await this.platformRepo.save(this.platformRepo.create(createPlatform));
        } catch (err) {
           throw new HttpException('数据库错误', 405);
        }
        return {code: 200, message: '创建成功'};
    }

    /**
     * 修改系统设置
     * @param updatePlatform
     */
    async updatePlatformEntity(updatePlatform: CreatePlatformInterface) {
        const platform = await this.platformRepo.findOne(updatePlatform.id);
        if (!platform) {
            return {code: 404, message: '当前平台设置信息不存在'};
        }
        try {
            await this.platformRepo.save(updatePlatform);
        } catch (err) {
            throw new HttpException('数据库错误', 405);
        }
        return {code: 200, message: '修改成功'};
    }

    /**
     * 查询系统设置信息
     * @param id
     */
    async findPlatformEntity(id ?: number) {
        return {code: 200, message: '查找成功', platform: await this.platformRepo.findOne(id)};
    }

    /**
     * 创建汇率
     * @param createRateInput
     */
    async createExchangeRateEntity(createRateInput: ExchangeRateInterface) {
        const count = await this.rateRepo.count({
            currencyName: createRateInput.currencyName
        });
        if (count > 0) return {code: 404, message: '汇率名称不能重复'};
        try {
            await this.rateRepo.save(this.rateRepo.create(createRateInput));
        } catch (err) {
            throw new HttpException('数据库错误', 405);
        }
        return {code: 200, message: '创建成功'};
    }

    /**
     * 修改汇率
     * @param updateRateInput
     */
    async updateExchangeRateEntity(updateRateInput: ExchangeRateInterface) {
        const rate = await this.rateRepo.findOne(updateRateInput.id);
        if (!rate) return {code: 404, message: '当前汇率不存在'};
        const count = await this.rateRepo.count({
            currencyName: updateRateInput.currencyName,
            id: Not(updateRateInput.id)
        });
        if (count > 0) return {code: 404, message: '汇率名称不能重复'};
        try {
            await this.rateRepo.save(updateRateInput);
        } catch (err) {
            throw new HttpException('数据库错误', 405);
        }
        return {code: 200, message: '修改成功'};
    }

    /**
     * 查询所有汇率
     * @param currencyName
     */
    async findAllRates(currencyName: string): Promise<ExchangeRateEntity [] > {
        const rates: ExchangeRateEntity [] = await this.rateRepo.find({
            currencyName: `%${currencyName ? currencyName : ''}%`
        });
        return rates;
    }
}