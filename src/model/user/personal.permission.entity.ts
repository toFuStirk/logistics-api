import {Entity, JoinColumn, Column, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './users.entity';
import {PermissionEntity} from './permission.entity';
@Entity('personal_permission')
export class PersonalPermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.personalPermissions)
    user: User;

    @OneToOne(type => PermissionEntity)
    @JoinColumn()
    permission: PermissionEntity;

    /**
     * personal permission status, 0 is been deleted, 1 is been added.
     */
    @Column()
    status: number;
}