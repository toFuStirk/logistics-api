import {IsString, IsInt, IsDate} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class InfoKVs {
    @ApiModelProperty()
    @IsInt()
    readonly key: number;

    @ApiModelProperty()
    @IsString()
    readonly value: string;

    @ApiModelProperty()
    @IsInt()
    relationId?: number;
}
export class BeforeAndAfter {
    @ApiModelProperty()
    @IsInt()
    before: number;
    @ApiModelProperty()
    @IsInt()
    after: number;
}
export class PageParams {
    @ApiModelProperty()
    @IsInt()
    pageSize: number;
    @ApiModelProperty()
    @IsInt()
    pageNumber: number;
}
export class UserLogin {
    @ApiModelProperty({description: '用户名'})
    @IsString()
    readonly username: string;

    @ApiModelProperty({description: '密码'})
    @IsString()
    readonly password: string;
}
export class CreateUserInput {
    @ApiModelProperty()
    @IsString()
    readonly username: string;

    @ApiModelProperty()
    @IsString()
    password: string;

    @ApiModelProperty()
    @IsString()
    readonly nickname?: string;

    @ApiModelProperty({type: InfoKVs, isArray: true})
    readonly infoKVs?: InfoKVs[];

    @ApiModelProperty({ type: Number, isArray: true })
    readonly roleIds?: number[];

    @ApiModelProperty({ type: Number, isArray: true })
    readonly organizationIds?: number[];
}
export class UserLogs extends PageParams {
    @ApiModelProperty()
    @IsString()
    username: string;
    @ApiModelProperty()
    @IsString()
    keywords: string;
    @ApiModelProperty()
    @IsDate()
    startTime: Date;
    @ApiModelProperty()
    @IsDate()
    endTime: Date;
}
export interface UserInfoData {
    userId: number;
    username: string;
    nickname: string;
    banned: boolean;
    recycle: boolean;
    createTime: string;
    updateTime: string;
    userRoles: {
        id: number;
        name: string
    }[];
    userOrganizations: {
        id: number;
        name: string;
    }[];
    userInfos: {
        id: number;
        order: number;
        relationId: number;
        type: string;
        name: string;
        value: string;
        description: string;
        registerDisplay: boolean;
        informationDisplay: boolean;
    }[];
}
export class UpdateUserInput {
    @ApiModelProperty()
    @IsInt()
    id: number;

    @ApiModelProperty()
    @IsString()
    username?: string;

    @ApiModelProperty()
    @IsString()
    nickname?: string;

    @ApiModelProperty()
    @IsString()
    password?: string;

    @ApiModelProperty({type: InfoKVs, isArray: true})
    infoKVs?: InfoKVs[];

    @ApiModelProperty({type: BeforeAndAfter, isArray: true})
    roleIds?: BeforeAndAfter[];

    @ApiModelProperty({type: BeforeAndAfter, isArray: true})
    organizationIds?: BeforeAndAfter[];
}
export class FindAllUser extends PageParams {
    @ApiModelProperty()
    @IsInt()
    roleId: number;
    @ApiModelProperty()
    @IsString()
    userName: string;
}
export interface UserLoginLogInterface {
    id?: number;
    userId?: number;
    userName?: string;
    action: string;
    loginRet?: string;
    loginIp: string;
    loginLocal: string;
    isMobile: string;
    platForm?: string;
    os: string;
    browser: string;
    language: string;
    createAt?: Date;
}