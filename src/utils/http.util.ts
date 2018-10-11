import {HttpException, Injectable} from "@nestjs/common";
import { post, get } from "request";

@Injectable()
export class HttpUtil {

    async dhlget(url: string, params: any):Promise<any> {
        const body:string = Object.keys(params).map((key) =>{
            return key + "=" +params[key];
        }).join("&");
        let json: any;
        let ex: any;
        await new Promise((ok, no)=>{
            // 以post形式发出请求
            get(url + "?" + body, { headers: {"Cache-Control": "no-cache" }, encoding: undefined}, (err, res, body) =>{
                if(err){
                    ex = new HttpException("网络错误"+ err.toString(), 404);
                    ok();
                    return;
                }else{
                    json = JSON.parse(body);
                    ok();
                    return;
                }
            })
        } );
        if(ex){
            throw ex;
        }else{
            return json;
        }
    }
}