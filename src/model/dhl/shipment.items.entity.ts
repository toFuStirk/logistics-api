import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {
    ConsigneeAddress,
    PickupAddress, ShipmentContents,
    ShipmentPieces,
    ValueAddedServices
} from '../../interfaces/dhl/dhl.label.req.body';
import {ShipmentEntity} from './shipment.entity';

@Entity('shipment_items_tab')
export class ShipmentItemsEntity {
    // 生成唯一单号
    @PrimaryColumn()
    shipmentNo: string;
    // 发货号码（物流商流水号）
    @Column({
        name: 'shipmentID',
        type: 'varchar',
        unique: true
    })
    shipmentID: string;
    // 收件人地址详情
    @Column({
        name: 'consigneeAddress',
        type: 'json'
    })
    consigneeAddress: ConsigneeAddress;
    // 退件地址详情
    @Column({
        name: 'returnAddress',
        type: 'json'
    })
    returnAddress: PickupAddress;
    // 退货指示
    @Column({
        name: 'returnMode',
        length: 10,
        nullable: true
    })
    returnMode: string;
    // 包裹描述
    @Column({
        name: 'packageDesc',
        length: 50,
        nullable: true
    })
    packageDesc: string;
    // 包裹总重量
    @Column({
        name: 'totalWeight',
        type: 'decimal',
        nullable: true
    })
    totalWeight: number;
    // 总重量单位
    @Column({
        name: 'totalWeightUOM',
        default: 'G'
    })
    totalWeightUOM: string;
    // 长度单位
    @Column({
        name: 'dimensionUOM',
        nullable: true
    })
    dimensionUOM: string;
    // 包裹高
    @Column({
        name: 'height',
        type: 'decimal',
        nullable: true
    })
    height: number;
    // 包裹长
    @Column({
        name: 'length',
        type: 'decimal',
        nullable: true
    })
    length: number;
    // 包裹宽
    @Column({
        name: 'weight',
        type: 'decimal',
        nullable: true
    })
    weight: number;
    // 包裹产品编码
    @Column({
        name: 'productCode',
    })
    productCode: string;
    // 国际贸易简制
    @Column({
        name: 'incoterm',
        nullable: true
    })
    incoterm: string;
    // 包裹总价值
    @Column({
        name: 'totalValue',
        type: 'decimal',
        nullable: true
    })
    totalValue: number;
    // 包裹总价值币种
    @Column({
        name: 'currency',
        length: 3,
        nullable: true
    })
    currency: string;
    // 包裹备注，出现在报关标签
    @Column({
        name: 'remarks',
        length: 200,
        nullable: true
    })
    remarks: string;
    // 只针对ws客户
    @Column({
        name: 'workshareIndicator',
        nullable: true,
        length: 2
    })
    workshareIndicator: string;
    // 货物是否有多件
    @Column({
        name: 'isMult',
        nullable: true,
        length: 5
    })
    isMult: string;
    // 仅对印度客户有效，如果提供，则必须开具发票。
    @Column({
        name: 'invoiceNumber',
        nullable: true
    })
    invoiceNumber: string;
    //  仅对印度客户有效，如果提供，那么invoiceNumber是强制性的。格式必须是YYYY-MM-DD。
    @Column({
        name: 'invoiceDate',
        nullable: true
    })
    invoiceDate: Date;
    // 期望值为真/假,对印度CSB-V客户强制执行。
    @Column({
        name: 'reverseCharge',
        nullable: true,
        length: 4
    })
    reverseCharge: string;
    // ISGT付款状态,对印度CSB-V客户强制执行。
    @Column({
        name: 'igstPaymentStatus',
        nullable: true,
        length: 1
    })
    igstPaymentStatus: string;
    // 发票的条款,对印度CSB-V客户强制执行。
    @Column({
        name: 'termsOfInvoice',
        length: 25,
        nullable: true
    })
    termsOfInvoice: string;
    // 装运。当isMult设置为“TRUE”时，这个块是必须的.整个块仅支持1.4版本及以上版本。
    @Column({
        name: 'shipmentPieces',
        type: 'json'
    })
    shipmentPieces: [ShipmentPieces];
    // 增值服务。
    @Column({
        name: 'valueAddedServices',
        type: 'json'
    })
    valueAddedServices: ValueAddedServices;
    // 包裹物品详细描述
    @Column({
        name: 'shipmentContents',
        type: 'json',
        nullable: true
    })
    shipmentContents: [ShipmentContents];
    // 包裹状态, 提货1 处理 2 关闭 3 取消或者删除 4
    @Column({
        name: 'parcelStatus',
        default: 0
    })
    parcelStatus: number;

    // 父级id
    @Column({
        name: 'parentId',
        nullable: true
    })
    parentId: number;
    // 父级
    @ManyToOne(type => ShipmentEntity, parent => parent.shipmentItems, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinColumn({name: 'parentId', referencedColumnName: 'id'})
    shipment: ShipmentEntity;
}