import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Label, PickupAddress, ShipmentItems, ShipperAddress} from '../../interfaces/dhl/dhl.label.req.body';
import {ShipmentItemsEntity} from './shipment.items.entity';
@Entity('shipment_label_tabs')
export class ShipmentEntity {
    // 自增id
    @PrimaryGeneratedColumn()
    id: number;
    // 创建用户
    @Column({
        name: 'userId',
        nullable: true
    })
    userId: number;
    // 提货地址详情
    @Column({
        name: 'pickupAddress',
        nullable: true,
        type: 'json'
    })
    pickupAddress: PickupAddress;
    // 发件人地址详情
    @Column({
        name: 'shipperAddress',
        type: 'json'
    })
    shipperAddress: ShipperAddress;
    // 标签
    @Column({
        name: 'label',
        type: 'json'
    })
    label: Label;
    // 是否发送email,Optional for PDR. If it is provided, email field will be mandatory.
    // This field is only applicable if productCode is PDR.Expected Value is TRUE/FALSE or true/false.
    @Column({
        name: 'sendEmail',
        default: false
    })
    sendEmail: boolean;
    // 	IGST Rate %, cannot exceed 100.Mandatory for India CSB-V customers
    @Column({
        name: 'igstRate',
        nullable: true,
        type: 'decimal'
    })
    igstRate: number;
    // Discount, cannot exceed Unit Price * Quantity. Mandatory for India CSB-V customers.
    @Column({
        name: 'discount',
        nullable: true,
        type: 'decimal'
    })
    discount: number;
    // Commodity under 3C. Expected Value is TRUE/FALSE or true/false.Mandatory for India CSB-V customers.
    @Column({
        name: 'commodityUnder3C',
        nullable: true,
    })
    commodityUnder3C: string;
    // MEIS.Expected Value is TRUE/FALSE or true/false. Mandatory for India CSB-V customers.
    @Column({
        name: 'meis',
        nullable: true
    })
    meis: string;
    // 状态 0 等待创建标签 ,1 创建成功
    @Column({
        name: 'status',
        default: '0'
    })
    status: number;
    // 发货包裹信息
    @OneToMany(type => ShipmentItemsEntity, items => items.shipment)
    shipmentItems: [ShipmentItems];
    // 创建日期
    @CreateDateColumn()
    createDate: Date;
}