import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, JwtReply} from '../../interfaces/user/jwt.interface';
import {User} from '../../model/user/users.entity';
import {Repository} from 'typeorm';
import {AuthenticationError} from 'apollo-server-core';
import {UserService} from './user.service';
import {AUTH_TOKEN_WHITE_LIST} from '../../constants/auth.constant';

@Injectable()
export class AuthService {
    secretKey = 'secretKey';
    expiresIn =  60 * 60 * 24;
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @Inject(forwardRef(() => UserService))
        @Inject(UserService) private readonly userService: UserService,
        @Inject(AUTH_TOKEN_WHITE_LIST) private readonly authTokenWhiteList
     ) {}
    async createToken(payload: JwtPayload): Promise<JwtReply> {
        const accessToken = jwt.sign(payload, 'secretKey', { expiresIn: '1d' });
        return { accessToken, expiresIn: 60 * 60 * 24 };
    }
    async validateUser(req) {
        if (req.body && this.authTokenWhiteList.includes(req.body.operationName)) {
            return true;
        }
        let token = req.headers.authorization;
        if (!token) {
            throw new UnauthorizedException('Request header lacks authorization parameters，it should be: Authorization or authorization');
        }
        token = token.slice(7);
        try {
            const decodedToken: string | object = jwt.verify(token, 'secretKey');
            return await this.userService.findOneWithRolesAndPermissions(JSON.parse(JSON.stringify(decodedToken)).loginName);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError('The authorization code is incorrect');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError('The authorization code has expired');
            }
        }
    }
    async validatePassport(loginName) {
        try {
            return await this.userService.findOneWithRolesAndPermissions(loginName);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError('The authorization code is incorrect');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError('The authorization code has expired');
            }
        }
    }
}
