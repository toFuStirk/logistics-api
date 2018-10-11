import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("dhl_token_details")
export class TokenEntity{
    @PrimaryGeneratedColumn()
    id: number;

    // 账户
    @Column({
        name: "clientId",
        length: 30
    })
    clientId: string;
    // 生成token
    @Column({
        name: "token",
        length: 60
    })
    token: string;
    // 有效时间
    @Column({
        name: "expiresTime",
        length: 30
    })
    expiresTime: string;
    // 生成时间
    @Column({
        name: "createAt",
    })
    createAt: Date;

}