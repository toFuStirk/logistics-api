import {Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {InfoItemEntity} from './info.item.entity';
import {RoleEntity} from './role.entity';
@Entity('info_group')
export class InfoGroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @ManyToMany(type => InfoItemEntity, InfoItem => InfoItem.infoGroups)
    infoItems: InfoItemEntity[];

    @OneToOne(type => RoleEntity, role => role.infoGroup, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    role: RoleEntity;
}