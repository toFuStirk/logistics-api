import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {User} from './users.entity';
import {InfoItemEntity} from './info.item.entity';

@Entity('user_info')
export class UserInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @ManyToOne(type => User, user => user.userInfos, {
        onDelete: 'CASCADE'
    })
    user: User;

    @ManyToOne(type => InfoItemEntity, infoItem => infoItem.userInfos, {
        onDelete: 'CASCADE'
    })
    infoItem: InfoItemEntity;
}