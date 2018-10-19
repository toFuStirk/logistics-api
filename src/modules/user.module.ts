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
import {AuthService} from '../service/user/auth.service';
import {PagerUtil} from '../utils/pager.util';
import {RoleService} from '../service/user/role.service';
import {RoleResolver} from '../resolvers/user/role.resolver';
import {OrganizationService} from '../service/user/organization.service';
import {OrganizationResolver} from '../resolvers/user/organization.resolver';
import {OrganizationEntity} from '../model/user/organization.entity';
import {EntityCheckService} from '../service/user/entity.check.service';
import {UserController} from '../controllers/user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "../service/user/auth.strategy";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 60 * 60 * 24
            }
        }),
        TypeOrmModule.forFeature([
            User,
            UserLoginLogsEntity,
            UserInfoEntity,
            OrganizationEntity,
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
        // JwtStrategy,
        PagerUtil,
        CryptoUtil,
        UserResolver,
        UserService,
        AuthService,
        RoleService,
        RoleResolver,
        EntityCheckService,
        OrganizationService,
        OrganizationResolver
    ],
    controllers: [
        UserController
    ],
    exports: [
        AuthService
    ]
})
@Global()
export class UserModule {}