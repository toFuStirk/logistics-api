import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, JwtReply} from '../../interfaces/user/jwt.interface';
import {User} from '../../model/user/users.entity';
import {Repository} from 'typeorm';
import {AuthenticationError} from 'apollo-server-core';

@Injectable()
export class AuthService {
    secretKey = 'secretKey';
    expiresIn =  60 * 60 * 24;
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) {}
    async createToken(payload: JwtPayload): Promise<JwtReply> {
        const accessToken = jwt.sign(payload, 'secretKey', { expiresIn: '1d' });
        return { accessToken, expiresIn: 60 * 60 * 24 };
    }
    async validateUser(req) {
       /* if (req.body && this.authTokenWhiteList.includes(req.body.operationName)) {
            return;
        }*/
        let token = req.headers.authorization;
        if (!token) {
            throw new UnauthorizedException('Request header lacks authorization parameters，it should be: Authorization or authorization');
        }
        token = token.slice(7);
       /* if (['Bearer', 'bearer'].includes(token.slice(0, 7))) {

        }*/
        try {
            const decodedToken: string | object = jwt.verify(token, 'secretKey');
            return this.usersRepository.findOne({username: JSON.parse(JSON.stringify(decodedToken)).loginName});
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
