import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import {UserInfoEntity} from './user.info.entity';
import {InfoGroupEntity} from './info.gourp.entity';

@Entity('info_item')
export class InfoItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    registerDisplay: boolean;

    @Column()
    informationDisplay: boolean;

    @Column()
    order: number;

    @OneToMany(type => UserInfoEntity, userInfo => userInfo.infoItem)
    userInfos: UserInfoEntity[];

    @ManyToMany(type => InfoGroupEntity, infoGroup => infoGroup.infoItems, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    infoGroups: InfoGroupEntity[];
}