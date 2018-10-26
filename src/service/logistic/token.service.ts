import {HttpException, Inject, Injectable} from '@nestjs/common';
import dhlApi from '../../config/logistic/dhl.config';
import {HttpUtil} from '../../utils/http.util';
import {DhlTokenResBody} from '../../interfaces/logistic/dhl/dhl.token.res.body';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/logistic/token.entity';
import {Repository} from 'typeorm';
import {LogisticsTypeService} from './logistics.type.service';
import {LogisticConfigEntity} from '../../model/logistic/logistic.config.entity';
@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @Inject(LogisticsTypeService) private readonly typeService: LogisticsTypeService,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
    ) {
    }

    /**
     * 刷新token
     * @returns {Promise<any>}
     */
    async refreshToken(name: string): Promise<any> {
        const type: LogisticConfigEntity | undefined = await this.typeService.findLogisticConfigByName(name);
        if (!type) {
            throw new HttpException('当前供应商配置信息不存在', 404);
        }
        const body = {clientId: type.clientId, password: type.password, returnFormat: 'json'};
        const result: DhlTokenResBody = await this.httpUtil.dhlGet(`${dhlApi.test}${dhlApi.token}`, body);
        await this.tokenRepository.save(
            await this.tokenRepository.create({
                clientId: result.accessTokenResponse.client_id,
                token: result.accessTokenResponse.token,
                companyType: name,
                expiresTime: result.accessTokenResponse.expires_in_seconds,
                createAt: new Date()
            })
        );
        return result.accessTokenResponse.token;
    }

    /**
     * 根据供应商类型查找token
     * @param name
     */
    async findTokenByTypeName(name): Promise<TokenEntity| undefined> {
        return await this.tokenRepository.findOne({companyType: name});
    }

}