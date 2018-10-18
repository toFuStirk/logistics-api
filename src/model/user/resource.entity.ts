import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PermissionEntity} from './permission.entity';
import {SystemModuleEntity} from './system.module.entity';

@Entity('resource')
export class ResourceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        unique: true
    })
    identify: string;

    @OneToMany(type => PermissionEntity, permission => permission.resource)
    permissions: PermissionEntity[];

    @ManyToOne(type => SystemModuleEntity, systemModule => systemModule.resources, {
        onDelete: 'CASCADE'
    })
    systemModule: SystemModuleEntity;
}