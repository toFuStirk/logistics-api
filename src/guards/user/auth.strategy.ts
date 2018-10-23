import {Injectable, UnauthorizedException, Inject} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../service/user/auth.service';
import { User } from '../../model/user/users.entity';

/*
认证策略，这里使用的是jsonwebtoken
JwtStrategy继承了PassportStrategy(Strategy)类，这个类构造函数中，保证passport采用这个策略
并且将参数赋值给JwtStrategy实例，第一个参数是选项，第二个参数是validate方法
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    /* 调用父类构造函数，使passport采用本策略 */
    super({
      /* token的获取方式，这里指的是从authorization请求头中获取`bearer ${token}`形式的token */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
      // issuer?: string;
      // audience?: string;
      // algorithms?: string[];
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  async validate(payload: User) {
    /* 调用AuthService里的验证函数 */
    const user = await this.authService.validatePassport(JSON.parse(JSON.stringify(payload)).loginName);
    /* 如果不存在，即返回false，则将异常传递给回调 */
    if (!user) {
      return (new UnauthorizedException(), false);
    }
    /* 如果存在将认证后的user返回给回调 */
    // @ts-ignore
      return (undefined, user);
  }
}
