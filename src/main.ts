import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    const options = new DocumentBuilder()
        .setTitle('logistics')
        .setDescription('The logistics API description')
        .setVersion('1.0')
        .addTag('logistics')
        .build();
    app.use(cross);
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
    app.use(['/api/user', ['/api/system']], (req, res, next) => {
        const whiteList = ['/login', '/findUserLoginLogs', '/createUser'];
        if (req.url && whiteList.includes(req.url)) {
            return next();
        }
        passport.authenticate('jwt', (err, user, info) => {
            console.log('user', user, 'info', info);
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