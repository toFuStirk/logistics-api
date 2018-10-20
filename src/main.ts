import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AppModule } from './app.module';

/**
 * 跨域问题
 * @param req
 * @param res
 * @param next
 */
const cross = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,X-Requested-With');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    /*const redisApp = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.REDIS,
        options: {
            url: 'redis://193.112.139.145:6868',
        },
        });*/
    app.use(cross);
    app.use(['/user'], (req, res, next) => {
        const whiteList = ['/login'];
        if (req.url && whiteList.includes(req.url)) {
            return next();
        }
        passport.authenticate('jwt', (err, user, info) => {
            if (info && info instanceof TokenExpiredError) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ code: 401, message: 'token过期，请重新登录'}));
            } else if (!user) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ code: 401, message: '授权失败，请检查 token 是否正确' }));
            } else {
                res.setHeader('Content-Type', 'application/json');
                req.user = user;
                next();
            }
        })(req, res);
    });
    await app.listen(3000);
    // await redisApp.listenAsync();
}

bootstrap().then(() => { console.log('Application is listening on port 3000'); });