import {HttpException, Injectable} from '@nestjs/common';
import { post, get } from 'request';

@Injectable()
export class HttpUtil {

    async dhlGet(url: string, params: any): Promise<any> {
        const body: string = Object.keys(params).map((key) => {
            return key + '=' + params[key];
        }).join('&');
        let json: any;
        let ex: any;
        await new Promise((ok, no) => {
            // 以post形式发出请求
            get(url + '?' + body, { headers: {'Cache-Control': 'no-cache' }, encoding: undefined}, (err, res, body) => {
                if (err) {
                    ex = new HttpException('网络错误' + err.toString(), 404);
                    ok();
                    return;
                } else {
                    console.log(body);
                    json = JSON.parse(body);
                    ok();
                    return;
                }
            });
        });
        if (ex) {
            throw ex;
        } else {
            return json;
        }
    }
    async dhlPost(url: string, params: any): Promise<any> {
        let json: any;
        let ex: any;
        const body = JSON.stringify(params);
        console.log('请求');
        console.log(body);
        await new Promise((ok, no) => {
            // 以post形式发出请求
            post(url , { body, encoding: undefined }, (err, res, body) => {
                if (err) {
                    ex = new HttpException('网络错误' + err.toString(), 404);
                    ok();
                    return;
                } else {
                    console.log('结果是', body);
                    json = JSON.parse(body);
                    ok();
                    return;
                }
            });
        });
    }
}