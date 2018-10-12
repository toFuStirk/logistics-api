import {HttpException, Inject, Injectable} from '@nestjs/common';
import {HttpUtil} from '../../utils/http.util';
import dhlApi from '../../config/dhl/api.config';
import {InjectRepository} from '@nestjs/typeorm';
import {TokenEntity} from '../../model/ahl/token.entity';
import {Repository} from 'typeorm';
import * as moment from 'moment';
import {DhlTrackingReqBody} from '../../interfaces/dhl/dhl.tracking.req.body';
import {DhlReqHeader} from '../../interfaces/dhl/dhl.req.header';
const dhlKey = require('../../config/dhl/key.config.json');


@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil,
    ) {}
    async tracking(trackingReferenceNumber: string[]) {
        const token: TokenEntity | undefined = await this.tokenRepository.findOne();
        if (!token) {
            throw new HttpException('token配置不存在', 404);
        }
        const params: DhlTrackingReqBody = {
            customerAccountId: undefined,
            pickupAccountId: dhlKey.PICKUPAccount,
            soldToAccountId: dhlKey.SOLDTOAccount,
            ePODRequired: 'Y',
            trackingReferenceNumber
        };
        const header: DhlReqHeader = {
            messageType: 'TRACKITEM',
            messageDateTime: moment(new Date()).utcOffset('+08:00').format(),
            accessToken: '2d9612905d751f2db6a598468edff1ee',
            messageLanguage: 'en',
            messageVersion: '1.0'
        };
        const body = {labelRequest : { hdr: header, bd: params}};
        const result = await this.httpUtil.dhlPost(`${dhlApi.test}${dhlApi.tracking}`, body);
        return result;
    }
}