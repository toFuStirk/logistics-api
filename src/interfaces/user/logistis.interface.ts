import {IsString, IsInt, IsBoolean} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {PageParams} from './user.interface';
export class LogistisInterfaceInput {
    @ApiModelProperty()
    @IsInt()
    id?: number;
    @ApiModelProperty({description: '物流提供商名称'})
    @IsString()
    logisticsProviderName: string;
    @ApiModelProperty({type: Boolean, description: '是否启用'})
    @IsBoolean()
    status: boolean;
    @ApiModelProperty()
    @IsString()
    clientId: string;
    @ApiModelProperty()
    @IsString()
    password: string;
    @ApiModelProperty()
    @IsString()
    SOLDTOAccount: string;
    @ApiModelProperty()
    @IsString()
    PICKUPAccount: string;
}
export class LogisticsConfig extends PageParams {
    @ApiModelProperty()
    @IsString()
    companyType: string;
    @ApiModelProperty()
    @IsString()
    username: string;
}