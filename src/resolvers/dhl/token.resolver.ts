import {Query, Resolver} from "@nestjs/graphql";
import {Inject} from "@nestjs/common";
import {TokenService} from "../../service/dhl/token.service";

@Resolver("token")
export class TokenResolver{
    constructor(
        @Inject(TokenService) private readonly tokenService: TokenService
    ){}
    @Query("getToken")
    async getToken(){
        const result = await this.tokenService.refreshToken();
        console.log(result);
    }
}