import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {ResourceEntity} from './resource.entity';

@Entity('system_module')
export class SystemModuleEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany(type => ResourceEntity, resource => resource.systemModule)
    resources: ResourceEntity[];
}
