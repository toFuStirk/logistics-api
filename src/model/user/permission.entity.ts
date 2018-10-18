import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {RoleEntity} from './role.entity';
import {ResourceEntity} from './resource.entity';
@Entity('permission')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => ResourceEntity, resource => resource.permissions, {
        onDelete: 'CASCADE'
    })
    resource: ResourceEntity;

    @Column()
    action: string;

    @Column({
        unique: true
    })
    identify: string;

    @ManyToMany(type => RoleEntity, role => role.permissions)
    roles: RoleEntity[];
}
