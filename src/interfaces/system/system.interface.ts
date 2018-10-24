import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsInt, IsNumber, IsString} from 'class-validator';

export class CreatePlatformInterface {
    @ApiModelProperty()
    @IsInt()
    id?: number;
    @ApiModelProperty()
    @IsString()
    platformName: string;
    @ApiModelProperty()
    @IsString()
    secondaryName: string;
    @ApiModelProperty()
    @IsBoolean()
    allowUserLogin: boolean;
    @ApiModelProperty()
    @IsString()
    promptInformation?: string;
    @ApiModelProperty()
    @IsString()
    platformCode: string;
    @ApiModelProperty()
    @IsString()
    themeColors: string;
}
export class ExchangeRateInterface {
    @ApiModelProperty({required: false})
    @IsInt()
    id?: number;
    @ApiModelProperty({type: String , description: '汇率名称'})
    @IsString()
    currencyName: string;
    @ApiModelProperty({type: Number, description: '汇率值'})
    @IsNumber()
    exchangeRate: number;
}