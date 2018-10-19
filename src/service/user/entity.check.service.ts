import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
@Injectable()
export class EntityCheckService {
    constructor(
        @InjectEntityManager() private entityManager: EntityManager
    ) { }

    async checkNameExist(entityClass: any, name: string) {
        const exist = await this.entityManager.findOne(entityClass, { name });
        if (exist) {
            return {code: 405, message: '当前名称已存在'};
        }
    }
}