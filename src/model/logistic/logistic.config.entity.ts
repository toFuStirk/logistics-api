import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('logistics_config')
export class LogisticConfigEntity {
   @PrimaryGeneratedColumn()
    id: number;
   // 物流提供商名称
    @Column({
        name: 'logisticsProviderName',
        unique: true
    })
    logisticsProviderName: string;
    // 是否启动
    @Column({
        default: true
    })
    status: boolean;

    // clientId
    @Column({
        name: 'clientId',
        nullable: true,
        length: 20
    })
    clientId: string;
    // password
    @Column({
        name: 'password',
        length: 40
    })
    password: string;
    // SOLDTOAccount
    @Column({
        name: 'SOLDTOAccount',
        nullable: true,
        length: 40
    })
    SOLDTOAccount: string;
    // PICKUPAccount
    @Column({
        name: 'PICKUPAccount',
        nullable: true,
        length: 40
    })
    PICKUPAccount: string;
    @CreateDateColumn()
     createAt: Date;
}