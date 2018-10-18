import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Destination, ServiceCode} from '../../interfaces/dhl/dhl.tracking.res.body';
import {TrackingItemsEntity} from './tracking.items.entity';

@Entity('dhl_track_tabs')
export class TrackingEntity {
    @PrimaryGeneratedColumn()
    id: number;
    // shipmentId
    @Column({
        name: 'shipmentId',
        length: 30
    })
    shipmentId: string;
    // trackingId
    @Column({
        name: 'trackingId',
        length: 30
    })
    trackingId: string;
    // orderNumber
    @Column({
        name: 'orderNumber',
        length: 30
    })
    orderNumber: string;
    // consignmentNoteNumber 托运单号
    @Column({
        name: 'consignmentNoteNumber',
        length: 30
    })
    // serviceCode
    @Column({
        name: 'serviceCode',
        type: 'json'
    })
    serviceCode: ServiceCode;
    // destination 目的地
    @Column({
        name: 'destination',
        type: 'json'
    })
    destination: Destination;
    // weight
    @Column({
        name: 'weight',
        length: 20
    })
    weight: string;
    // weightUnit
    @Column({
        name: 'weightUnit',
        default: 'G',
        length: 4
    })
    weightUnit: string;
    // 具体事件
    @OneToMany(type => TrackingItemsEntity, items => items.tracks)
    events: TrackingItemsEntity[];
}