import {Query, Resolver} from '@nestjs/graphql';
import {Inject, UseGuards} from '@nestjs/common';
import {TokenService} from '../../service/dhl/token.service';
import {JwtAuthGuard} from '../../service/user/jwt-auth.guard';
import {Permission, Resource} from '../../decorator';
@Resource({name: 'token生成', identify: 'token:getToken'})
export class TokenResolver {
    constructor(
        @Inject(TokenService) private readonly tokenService: TokenService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Permission({name: '刷新token', identify: 'token/刷新token', action: 'find'})
    @Query('getToken')
    async getToken() {
        const result = await this.tokenService.refreshToken();
        console.log(result);
    }
}