import {Inject, Injectable} from '@nestjs/common';
import dhlApi from '../../config/dhl/api.config';
import {HttpUtil} from '../../utils/http.util';
import {DhlTokenResBody} from '../../interfaces/dhl/dhl.token.res.body';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/dhl/token.entity';
import {Repository} from 'typeorm';
const dhlKey = require('../../config/dhl/key.config.json');
@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
    ) {}

    /**
     * 刷新token
     * @returns {Promise<any>}
     */
    async refreshToken(): Promise<any> {
        const body = {clientId: dhlKey.clientId, password: dhlKey.password, returnFormat: 'json'};
        const result: DhlTokenResBody = await this.httpUtil.dhlGet(`${dhlApi.test}${dhlApi.token}`, body);
        await this.tokenRepository.save(
            await this.tokenRepository.create({
                clientId: result.accessTokenResponse.client_id,
                token: result.accessTokenResponse.token,
                expiresTime: result.accessTokenResponse.expires_in_seconds,
                createAt: new Date()
            })
        );
       return result.accessTokenResponse.token;
    }

}