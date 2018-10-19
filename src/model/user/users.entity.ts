import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import moment = require('moment');
import {UserInfoEntity} from './user.info.entity';
import {RoleEntity} from './role.entity';
import {PersonalPermissionEntity} from './personal.permission.entity';
import {OrganizationEntity} from './organization.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: true
    })
    username: string;

    @Column({
        unique: true,
        nullable: true
    })
    mobile: string;

    @Column()
    password: string;

    @Column({
        default: false
    })
    banned: boolean;

    @Column({
        default: false
    })
    recycle: boolean;
    // 用户信息组
    @OneToMany(type => UserInfoEntity, userInfo => userInfo.user)
    userInfos: UserInfoEntity[];
    // 用户角色
    @ManyToMany(type => RoleEntity, role => role.users, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    roles: RoleEntity[];
    // 用户组织
    @ManyToMany(type => OrganizationEntity, organization => organization.users, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    organizations: OrganizationEntity[];
    // 用户权限
    @OneToMany(type => PersonalPermissionEntity, personalPermission => personalPermission.user)
    personalPermissions: PersonalPermissionEntity[];
    @CreateDateColumn({
        transformer: {
            from: (date: Date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: () => {
                return new Date();
            }
        }
    })
    createTime: string;

    @UpdateDateColumn({
        transformer: {
            from: (date: Date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: () => {
                return new Date();
            }
        }
    })
    updateTime: string;
}