import {Column, Entity, ManyToMany, PrimaryGeneratedColumn, TreeChildren, TreeParent} from 'typeorm';
import {User} from './users.entity';

@Entity('organization')
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
    id: number;
    // 组织名称
    @Column()
    name: string;
    // 用户
    @ManyToMany(type => User, user => user.organizations)
    users: User[];
    // 父级
    @TreeParent()
    parent: OrganizationEntity;
    // 子集
    @TreeChildren()
    children: OrganizationEntity[];
}