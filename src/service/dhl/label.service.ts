import {HttpException, Inject, Injectable} from "@nestjs/common";
import {HttpUtil} from "../../utils/http.util";
import {
    PickupAddress, ShipmentItems, ShipperAddress, Label,
    DhlLabelReqBody
} from "../../interfaces/dhl/dhl.label.req.body";
import {InjectRepository} from "@nestjs/typeorm";
import {TokenEntity} from "../../model/ahl/token.entity";
import {Repository} from "typeorm";

@Injectable()
export class LabelService{
    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
        @Inject(HttpUtil) private readonly httpUtil: HttpUtil
    ){}
    async Label(pickupAddress: [PickupAddress], shipperAddress: [ShipperAddress], shipmentItems: [ShipmentItems], label:[Label]){
        const token: TokenEntity | undefined = await this.tokenRepository.findOne();
        if(!token){
            throw new HttpException("token配置不存在", 404);
        }
        const params: DhlLabelReqBody = {
            pickupAccountId:
        }
    }
}