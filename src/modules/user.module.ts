import {Global, Inject, Module, MulterModule, OnModuleInit} from '@nestjs/common';
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
import { __ as t } from 'i18n';
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
import {JwtStrategy} from '../service/user/auth.strategy';
import {In, Not, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {ModulesContainer} from '@nestjs/core/injector';
import {MetadataScanner} from '@nestjs/core/metadata-scanner';
import {PERMISSION_DEFINITION, RESOURCE_DEFINITION} from './../decorator';
import {ResourceService} from '../service/user/resource.service';
import authConstant = require('./../constants/auth.constant');
import {HttpUtil} from '../utils/http.util';
import {ApiConfigEntity} from '../model/user/api.config.entity';
import {PlatformEntity} from '../model/system/platform.entity';
import {SystemService} from '../service/system/system.service';
import {SystemController} from '../controllers/system.controller';
import {ExchangeRateEntity} from '../model/system/exchange_rate.entity';

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
            ApiConfigEntity,
            UserLoginLogsEntity,
            UserInfoEntity,
            OrganizationEntity,
            InfoGroupEntity,
            InfoItemEntity,
            PersonalPermissionEntity,
            PermissionEntity,
            RoleEntity,
            ResourceEntity,
            SystemModuleEntity,
            PlatformEntity,
            ExchangeRateEntity
        ])
    ],
    providers: [
        HttpUtil,
        PagerUtil,
        CryptoUtil,
        UserResolver,
        UserService,
        AuthService,
        JwtStrategy,
        RoleService,
        RoleResolver,
        EntityCheckService,
        OrganizationService,
        OrganizationResolver,
        ResourceService,
        SystemService
    ],
    controllers: [
        UserController,
        SystemController
    ],
    exports: [
        AuthService
    ]
})
@Global()
export class UserModule implements OnModuleInit {
    private readonly metadataScanner: MetadataScanner;
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
        @InjectRepository(InfoGroupEntity) private readonly infoGroupRepo: Repository<InfoGroupEntity>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(ResourceEntity) private readonly resourceRepo: Repository<ResourceEntity>,
        @InjectRepository(PermissionEntity) private readonly permissionRepo: Repository<PermissionEntity>,
        @InjectRepository(SystemModuleEntity) private readonly systemModuleRepo: Repository<SystemModuleEntity>,
        private readonly modulesContainer: ModulesContainer,
    ) {   this.metadataScanner = new MetadataScanner(); }
    static forRoot(options: {
        authTokenWhiteList?: string[];
    }) {
        if (options.authTokenWhiteList) {
            options.authTokenWhiteList.push(...['IntrospectionQuery', 'adminLogin', 'register']);
        }
        else {
            options.authTokenWhiteList = ['IntrospectionQuery', 'login', 'adminLogin', 'register'];
        }
        return {
            providers: [{ provide: authConstant.AUTH_TOKEN_WHITE_LIST, useValue: options.authTokenWhiteList }],
            module: UserModule
        };
    }
    // @ts-ignore
    async onModuleInit() {
        await this.loadResourcesAndPermissions();
        await this.createDefaultRole();
        await this.createDefaultInfoGroup();
        await this.createSuperAdmin();
    }
    async loadResourcesAndPermissions() {
        const metadataMap: Map<string, { name: string, resource: ResourceEntity[] }> = new Map();
        this.modulesContainer.forEach((moduleValue, moduleKey) => {
            for (const [key, value] of [...moduleValue.components, ...moduleValue.routes]) {
                const isResolverOrController = Reflect.getMetadataKeys(value.instance.constructor)
                    .filter(key => ['graphql:resolver_type', 'path']
                        .includes(key)).length > 0;
                if (isResolverOrController) {
                    const resource: ResourceEntity = Reflect.getMetadata(RESOURCE_DEFINITION, value.instance.constructor);
                    const prototype = Object.getPrototypeOf(value.instance);
                    if (resource && prototype) {
                        const permissions: PermissionEntity[] = this.metadataScanner.scanFromPrototype(value.instance, prototype, name => {
                            return Reflect.getMetadata(PERMISSION_DEFINITION, value.instance, name);
                        });
                        if (resource.permissions) {
                            resource.permissions.push(...permissions);
                        }
                        else {
                            resource.permissions = permissions;
                        }
                        console.log('名称', moduleValue.metatype.name);
                        if (metadataMap.has(moduleKey)) {
                            console.log('抛出异常');
                            console.log('名称', moduleValue.metatype.name);
                            metadataMap.get(moduleKey).name = moduleValue.metatype.name;
                            metadataMap.get(moduleKey).resource.push(resource);
                        }
                        else {
                            metadataMap.set(moduleKey, { name: moduleValue.metatype.name, resource: [resource] });
                        }
                    }
                }
            }
        });
        metadataMap.forEach(value => {
            value.resource.forEach(resource => {
                console.log('resource.name');
                console.log(resource.name);
                resource.name = resource.name;
                resource.permissions.forEach(p => p.name = p.name);
            });
        });
        const scannedModules: { id: string, name: string }[] = [];
        metadataMap.forEach((v, k) => {
            scannedModules.push({ id: k, name: v.name });
        });
        const notExistingModule = await this.systemModuleRepo.find({
            where: { id: Not(In(scannedModules.length ? scannedModules.map(v => v.id) : ['all'])) }
        });
        if (notExistingModule.length) {
            await this.systemModuleRepo.delete(notExistingModule.map(v => v.id));
        }
        const existingModules = await this.systemModuleRepo.find({ order: { id: 'ASC' } });
        console.log('进行排序');
        const newModules = scannedModules.filter(sm => !existingModules.map(v => v.id).includes(sm.id));
        console.log('进行保存');
        console.log(newModules, newModules.length);
        if (newModules.length) {
            console.log('批量2');
            await this.systemModuleRepo.save(newModules);
        }
        if (existingModules.length) {
            console.log('批量1');
            existingModules.forEach(em => {
                em.name = scannedModules.find(sm => sm.id === em.id).name;
            });
            console.log('exist保存');
            await this.systemModuleRepo.save(existingModules);
        }
        for (const [key, value] of metadataMap) {
            console.log('便利');
            const resourceModule = await this.systemModuleRepo.findOne({ where: { id: key  } });
            value.resource.forEach(async resouece => {
                resouece.systemModule = resourceModule;
            });
        }
        const scannedResources: ResourceEntity [] =  <ResourceEntity[]>[].concat(...[...metadataMap.values()].map(v => v.resource));
        const resourceIdentifies = scannedResources.length ? scannedResources.map(v => v.identify) : ['__delete_all_resource__'];
        const notExistResources = await this.resourceRepo.find({ where: { identify: Not(In(resourceIdentifies)) } });
        if (notExistResources.length > 0) {
            await this.resourceRepo.delete(notExistResources.map(v => v.id));
        }
        const existResources = await this.resourceRepo.find({ order: { id: 'ASC' } });
        const newResourcess = scannedResources.filter(sr => !existResources.map(v => v.identify).includes(sr.identify));
        if (newResourcess.length > 0) {
            await this.resourceRepo.save(this.resourceRepo.create(newResourcess));
        }
        if (existResources.length) {
            existResources.forEach(er => {
                er.name = scannedResources.find(sr => sr.identify === er.identify).name;
            });
            await this.resourceRepo.save(existResources);
        }
        const scannedPermissions = <PermissionEntity[]>[].concat(...scannedResources.map(metadataValue => {
            metadataValue.permissions.forEach(v => v.resource = metadataValue);
            return metadataValue.permissions;
        }));
        if (scannedPermissions.length) {
            const resource = await this.resourceRepo.find({ where: { identify: In(scannedPermissions.map(v => v.resource.identify)) } });
            scannedPermissions.forEach(permission => {
                permission.resource = resource.find(v => v.identify === permission.resource.identify);
            });
        }
        const permissionIdentifies = scannedPermissions.length ? scannedPermissions.map(v => v.identify) : ['__delete_all_permission__'];
        const notExistPermissions = await this.permissionRepo.find({ where: { identify: Not(In(permissionIdentifies)) } });
        if (notExistPermissions.length > 0) {
            await this.permissionRepo.delete(notExistPermissions.map(v => v.id));
        }
        const existPermissions = await this.permissionRepo.find({ order: { id: 'ASC' } });
        const newPermissions = scannedPermissions.filter(sp => !existPermissions.map(v => v.identify).includes(sp.identify));
        if (newPermissions.length > 0) {
            await this.permissionRepo.save(this.permissionRepo.create(newPermissions));
        }
        if (existPermissions.length) {
            existPermissions.forEach(ep => {
                ep.name = scannedPermissions.find(sp => sp.identify === ep.identify).name;
                ep.action = scannedPermissions.find(sp => sp.identify === ep.identify).action;
            });
            await this.permissionRepo.save(existPermissions);
        }
    }
    private async createDefaultRole() {
        const defaultRole = await this.roleRepo.findOne(1);
        if (defaultRole) return;
        await this.roleRepo.save(this.roleRepo.create({
            id: 1,
            name: 'ordinary user'
        }));
    }
    private async createDefaultInfoGroup() {
        const defaultInfoGroup = await this.infoGroupRepo.findOne(1);
        if (defaultInfoGroup) return;
        await this.infoGroupRepo.save(this.infoGroupRepo.create({
            id: 1,
            name: 'ordinary user information group',
            role: {
                id: 1
            }
        }));
    }

    /**
     * Create a system super administrator
     */
    private async createSuperAdmin() {
        const sadmin = await this.userRepo.findOne({ where: { username: 'sadmin' } });
        if (sadmin) return;
        await this.userService.createUser({ username: 'sadmin', password: 'sadmin' });
    }
}