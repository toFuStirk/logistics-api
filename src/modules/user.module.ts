import {Global, Module, MulterModule, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../model/user/users.entity';
import {UserLoginLogsEntity} from '../model/user/user.login.logs.entity';
import {UserInfoEntity} from '../model/user/user.info.entity';
import {InfoGroupEntity} from '../model/user/info.gourp.entity';
import {InfoItemEntity} from '../model/user/info.item.entity';
import {PersonalPermissionEntity} from '../model/user/personal.permission.entity';
import {PermissionEntity} from '../model/user/permission.entity';
import {RoleEntity} from '../model/user/role.entity';
import {ResourceEntity} from '../model/user/resource.entity';
import {SystemModuleEntity} from '../model/user/system.module.entity';
import {CryptoUtil} from '../utils/crypto.util';
import {UserResolver} from '../resolvers/user/user.resolver';
import {UserService} from '../service/user/user.service';
import {AuthService} from "../service/user/auth.service";
import {PagerUtil} from "../utils/pager.util";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserLoginLogsEntity,
            UserInfoEntity,
            InfoGroupEntity,
            InfoItemEntity,
            PersonalPermissionEntity,
            PermissionEntity,
            RoleEntity,
            ResourceEntity,
            SystemModuleEntity
        ])
    ],
    providers: [
        PagerUtil,
        CryptoUtil,
        UserResolver,
        UserService,
        AuthService
    ]
})
@Global()
export class UserModule {}