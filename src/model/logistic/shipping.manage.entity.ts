import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';
@Entity('shipping_menage_tabs')
export class ShippingManageEntity {
    @PrimaryGeneratedColumn()
    id: number;
    // 公司类型
    @Column({
        name: 'companyType',
        length: 15
    })
    companyType: string;
    // 用户id
    @Column() userId: number;
    // 用户名称
    @Column() username: string;
    // 上传数量
    @Column() uploadNumber: number;
    // 状态
    @Column() status: string;

    @CreateDateColumn()
    createAt: Date;
}