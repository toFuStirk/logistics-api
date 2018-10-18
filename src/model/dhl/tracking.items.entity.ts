import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {AddressInterface} from '../../interfaces/dhl/dhl.tracking.res.body';
import {TrackingEntity} from './tracking.entity';
@Entity('dhl_track_items_tab')
export class TrackingItemsEntity {
    @PrimaryGeneratedColumn()
    id: number;
    /*物流信息Id*/
    @Column({ nullable: true })
    parentId: number;
    // status
    @Column({
        name: 'status',
        nullable: true,
        length: 30
    })
    status: string;
    // description
    @Column({
        name: 'description',
        length: 50,
        nullable: true
    })
    description: string;
    // timestamp
    @Column({
        name: 'timestamp',
        length: 20,
        nullable: true
    })
    timestamp: string;
    // timezone
    @Column({
        name: 'timezone',
        length: 10,
        nullable: true
    })
    timezone: string;
    // 地址
    @Column({
        name: 'address',
        nullable: true,
        type: 'json'
    })
    address: AddressInterface;
    // 父级
    @ManyToOne(type => TrackingEntity, track => track.events, {
        cascade: true,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinTable()
    tracks: TrackingEntity;
}