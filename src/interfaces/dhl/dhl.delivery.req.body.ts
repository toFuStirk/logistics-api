import {IsString, IsInt} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {PageParams} from '../user/user.interface';
export class DhlDeliveryReqBody {
    // 用户id
    @ApiModelProperty({description: '用户id', required: false})
    @IsInt()
    userId: number;
    // 公司名称
    @ApiModelProperty({description: '公司名称', maxLength: 30, required: false})
    @IsString()
    companyName: string;
    // 名称
    @ApiModelProperty({description: '联系人', maxLength: 50, required: false})
    @IsString()
    name: string;
    // 地址1
    @ApiModelProperty({description: '地址1', maxLength: 50, required: true})
    @IsString()
    address1: string;
    // 地址2
    @ApiModelProperty({description: '地址2', maxLength: 50, required: false})
    @IsString()
    address2: string;
    // 地址3
    @ApiModelProperty({description: '地址3', maxLength: 50, required: false})
    @IsString()
    address3: string;
    // 城市
    @ApiModelProperty({description: '城市', maxLength: 30, required: false})
    @IsString()
    city: string;
    // 省或州
    @ApiModelProperty({description: '省或州', maxLength: 20, required: false})
    @IsString()
    state: string;
    // 区
    @ApiModelProperty({description: '区', maxLength: 20, required: false})
    @IsString()
    district: string;
    // 国家
    @ApiModelProperty({description: '国家', maxLength: 2, required: true})
    @IsString()
    country: string;
    // 邮政编码
    @ApiModelProperty({description: '邮政编码', maxLength: 10, required: false})
    @IsString()
    postCode: string;
    // 电话
    @ApiModelProperty({description: '电话', maxLength: 20, required: false})
    @IsString()
    phone: string;
    // 邮箱
    @ApiModelProperty({description: '邮箱', maxLength: 50, required: false})
    @IsString()
    email: string;
}
export class DeliveryParams extends PageParams {
    @ApiModelProperty()
    @IsString()
    username: string;
}
export class DeliveryParamUserId {
    @ApiModelProperty({required: false})
    @IsInt()
    userId: number;
}