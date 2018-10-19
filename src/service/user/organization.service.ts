import {HttpException, Inject, Injectable} from '@nestjs/common';
import {EntityCheckService} from './entity.check.service';
import {Repository, TreeRepository} from 'typeorm';
import {User} from '../../model/user/users.entity';
import {OrganizationEntity} from '../../model/user/organization.entity';
import {InjectRepository} from '@nestjs/typeorm';


@Injectable()
export class OrganizationService {
    constructor(
        @Inject(EntityCheckService) private readonly entityCheckService: EntityCheckService,
        @InjectRepository(OrganizationEntity) private readonly organizationReq: TreeRepository<OrganizationEntity>,
        @InjectRepository(User) private readonly userRep: Repository<User>) {}
    /**
     * Query root organizations
     */
    async findRoots(): Promise<OrganizationEntity[]> {
        return this.organizationReq.findRoots();
    }

    /**
     * Query all organizations tree node
     */
    async findAllTrees(): Promise<OrganizationEntity[]> {
        return this.organizationReq.findTrees();
    }

    /**
     * Query all suborganizations under the specified organization
     *
     * @param id The specified organizaiton id
     */
    async findChildren(id: number): Promise<OrganizationEntity> {
        const exist = await this.organizationReq.findOne(id);
        if (!exist) {
            throw new HttpException('当前组织不存在', 404);
        }
        const children = await this.organizationReq.findDescendantsTree(exist);
        return children;
    }

    /**
     * Create a organization
     *
     * @param name The organization's name
     * @param parentId The organization's parent id
     */
    async createOrganization(name: string, parentId: number): Promise<void> {
        let parent: OrganizationEntity | undefined;
        if (parentId) {
            parent = await this.organizationReq.findOne(parentId);
            if (!parent) {
                throw new HttpException('父级组织不存在', 404);
            }
        }

        await this.entityCheckService.checkNameExist(OrganizationEntity, name);

        const organization: OrganizationEntity = this.organizationReq.create({ name, parent });
        try {
            await this.organizationReq.save(organization);
        } catch (err) {
            throw new HttpException('数据库错误', 500);
        }
    }

    /**
     * Update organization
     *
     * @param id The specified organizaiton id
     * @param name The organization's name
     * @param parentId The organization's parent id
     */
    async updateOrganization(id: number, name: string, parentId: number): Promise<void> {
        const exist = await this.organizationReq.findOne(id);
        if (!exist) {
            throw new HttpException('当前组织不存在', 404);
        }

        if (name !== exist.name) {
            await this.entityCheckService.checkNameExist(OrganizationEntity, name);
        }

        let parent: OrganizationEntity | undefined;
        if (parentId) {
            parent = await this.organizationReq.findOne(parentId);
            if (!parent) {
                throw new HttpException('当前父组织不存在', 404);
            }
        }
        try {
            exist.name = name;
            exist.parent = parent as any;
            await this.organizationReq.save(exist);
        } catch (err) {
            throw new HttpException('数据库错误', 500);
        }
    }

    /**
     * Delete organization
     *
     * @param id The specified organizaiton id
     */
    async deleteOrganization(id: number): Promise<void> {
        const exist = await this.organizationReq.findOne(id);
        if (!exist) {
            throw new HttpException('当前组织不存在', 404);
        }

        const children = await this.organizationReq.findDescendants(exist);
        if (children) {
            throw new HttpException('当前组织下有子组织', 404);        }
        try {
            await this.organizationReq.delete(id);
        } catch (err) {
            throw new HttpException('数据库错误', 500);
        }
    }

    /**
     * Add users to the organization
     *
     * @param id The specified organizaiton id
     * @param userIds The specified users id to be add
     */
    async addUsersToOrganization(id: number, userIds: number[]): Promise<void> {
        const exist = await this.organizationReq.findOne(id, { relations: ['users'] });
        if (!exist) {
            throw new HttpException('当前组织不存在', 404);
        }

        const userArr = await this.userRep.findByIds(userIds);
        userIds.forEach(userId => {
            const find: User | undefined = userArr.find(user => {
                return user.id === userId;
            });
            if (!find) {
                throw new HttpException('当前用户不存在', 404);
            }
        });

        exist.users.forEach(user => {
            const find = userIds.find(id => {
                return id === user.id;
            });
            if (find) {
                throw new HttpException('当前用户已是该组织成员', 404);
            }
        });
        exist.users.push(...userArr);
        try {
            await this.organizationReq.save(exist);
        } catch (err) {
            throw new HttpException('数据库错误', 500);
        }
    }

    /**
     * Delete users under the organization
     *
     * @param id The specified organizaiton id
     * @param userIds The specified users id
     */
    async deleteUserFromOrganization(id: number, userIds: number[]): Promise<void> {
        const exist = await this.organizationReq.findOne(id, { relations: ['users'] });
        if (!exist) {
            throw new HttpException('当前组织不存在', 404);
        }

        const userArr = await this.userRep.findByIds(userIds);
        userIds.forEach(userId => {
            const find: User | undefined = userArr.find(user => {
                return user.id === userId;
            });
            if (!find) {
                throw new HttpException('当前用户不是该组织成员', 404);
            }
            const index = exist.users.findIndex(user => {
                return user.id === userId;
            });
            if (index < 0) {
                throw new HttpException('当前用户不是该组织成员', 404);
            }
            exist.users.splice(index, 1);
        });
        try {
            await this.organizationReq.save(exist);
        } catch (err) {
            throw new HttpException('数据库错误', 500);
        }
    }
}