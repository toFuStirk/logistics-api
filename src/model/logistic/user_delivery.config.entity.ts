import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('user_delivery_config')
export class UserDeliveryConfigEntity {
    @PrimaryGeneratedColumn()
    id: number;
    // 用户id,一个用户只能有一个发货信息配置项
    @Column({
        unique: true
    })
    userId: number;
    // 公司名称
    @Column({
        name: 'companyName',
        length: 30,
        nullable: true,
    })
    companyName: string;
    // 名称
    @Column({
        name: 'name',
        length: 50
    })
    name: string;
    // 地址1
    @Column({
        name: 'address1',
        length: 50
    })
    address1: string;
    // 地址2
    @Column({
        name: 'address2',
        length: 50,
        nullable: true
    })
    address2: string;
    // 地址3
    @Column({
        name: 'address3',
        length: 50,
        nullable: true
    })
    address3: string;
    // 城市
    @Column({
        name: 'city',
        length: 30,
        nullable: true
    })
    city: string;
    // 省或州
    @Column({
        name: 'state',
        length: 20,
        nullable: true
    })
    state: string;
    // 区
    @Column({
        name: 'district',
        length: 20,
        nullable: true
    })
    district: string;
    // 国家
    @Column({
        name: 'country',
        length: 2
    })
    country: string;
    // 邮政编码
    @Column({
        name: 'postCode',
        length: 10,
        nullable: true
    })
    postCode: string;
    // 电话
    @Column({
        name: 'phone',
        length: 20,
        nullable: true
    })
    phone: string;
    // 邮箱
    @Column({
        name: 'email',
        length: 50,
        nullable: true
    })
    email: string;
    // 创建日期
    @CreateDateColumn()
    createAt: Date;
    // 修改日期
    @UpdateDateColumn()
    updateAt: Date;
}