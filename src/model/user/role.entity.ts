import {Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './users.entity';
import {InfoGroupEntity} from './info.gourp.entity';
import {PermissionEntity} from './permission.entity';

@Entity('role')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @ManyToMany(type => PermissionEntity, permission => permission.roles, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    permissions: PermissionEntity[];

    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @OneToOne(type => InfoGroupEntity, infoGroup => infoGroup.role)
    infoGroup: InfoGroupEntity;
}