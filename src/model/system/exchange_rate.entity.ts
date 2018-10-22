import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
/* 汇率表 */
@Entity('exchange_rate_tabs')
export class ExchangeRateEntity {
    @PrimaryGeneratedColumn()
    id: number;
    /* 货币名称 */
    @Column({
        name: 'currencyName',
        length: 10
    })
    currencyName: string;
    /* 汇率*/
    @Column({
        name: 'exchangeRate',
        type: 'decimal',
        nullable: true
    })
    exchangeRate: number;
    @CreateDateColumn()
    createAt: Date;
    @UpdateDateColumn()
    updateAt: Date;
}