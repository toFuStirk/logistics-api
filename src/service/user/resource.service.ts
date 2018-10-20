import {Inject, Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {ResourceEntity} from "../../model/user/resource.entity";
import {Repository} from "typeorm";
import {SystemModuleEntity} from "../../model/user/system.module.entity";

@Injectable()
export class ResourceService {
    constructor(
        @InjectRepository(ResourceEntity) private readonly resourceRepo: Repository<ResourceEntity>,
        @InjectRepository(SystemModuleEntity) private readonly systemModuleRepo: Repository<SystemModuleEntity>
    ) {}
    async findResources(moduleId) {
        return this.resourceRepo.find({ where: { module: { id: moduleId } }, relations: ['permissions'] });
    }
    async findSystemModules() {
        return this.systemModuleRepo.find();
    }
}