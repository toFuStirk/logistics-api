import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
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
    await app.listen(3000);
    // await redisApp.listenAsync();
}

bootstrap().then(() => { console.log('Application is listening on port 3000'); });