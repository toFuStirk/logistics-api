import {HttpException, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleEntity} from '../../model/user/role.entity';
import {Repository} from 'typeorm';
import {EntityCheckService} from './entity.check.service';
import {PermissionEntity} from '../../model/user/permission.entity';

@Injectable()
export class RoleService {
    constructor (
        @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private readonly permissionRepo: Repository<PermissionEntity>,
        @Inject(EntityCheckService) private checkService: EntityCheckService
    ) {}
    /**
     * Create a role
     *
     * @param name The role's name
     */
    async createRole(name: string) {
        await this.checkService.checkNameExist(RoleEntity, name);
        await this.roleRepo.save(this.roleRepo.create({ name }));
    }

    /**
     * Update the specified role's name
     *
     * @param id The specified role's id
     * @param name The name to be update
     */
    async updateRole(id: number, name: string) {
        const role = await this.roleRepo.findOne(id);
        if (!role) {
            return {code: 404, message: '当前role不存在'};
        }
        if (name !== role.name) {
            await this.checkService.checkNameExist(RoleEntity, name);
        }
        role.name = name;
        await this.roleRepo.save(role);
    }
    async setPermissions(id, permissionIds) {
        const role = await this.roleRepo.findOne(id);
        if (!role) {
            throw new HttpException(`The role id of ${id.toString()} does not exist`, 404);
        }
        const permissionArr = await this.permissionRepo.findByIds(permissionIds);
        permissionIds.forEach(permissionId => {
            const exist = permissionArr.find(permission => {
                return permission.id === permissionId;
            });
            if (!exist) {
                throw new HttpException(`The permission id of ${permissionId.toString()} does not exist`,  404);
            }
        });
        role.permissions = permissionArr;
        await this.roleRepo.save(role);
    }

    /**
     * Delete role
     *
     * @param id The specified role's id
     */
    async deleteRole(id: number) {
        const role = await this.roleRepo.findOne(id, { relations: ['permissions'] });
        if (!role) {
            return {code: 404, message: '当前role不存在'};
        }
        try {
            this.roleRepo.createQueryBuilder('role').relation(RoleEntity, 'permissions').of(role).remove(role.permissions);
            await this.roleRepo.remove(role);
        } catch (err) {
            return {code: 500, message: '数据库错误'};
        }
    }
    /**
     * Query all roles
     */
    async findRoles() {
        return this.roleRepo.find();
    }
}