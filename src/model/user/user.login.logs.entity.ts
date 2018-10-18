import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('user_login_logs')
export class UserLoginLogsEntity {
   @PrimaryGeneratedColumn()
    id: number;
   // 用户id
    @Column() userId: number;
    // 用户名
    @Column() userName: string;
    // 操作
    @Column({
        name: 'action',
        length: 10,
        default: '登录'
    })
    action: string;
    // 操作结果
    @Column({
        name: 'login_ret',
        length: 15
    })
    loginRet: string;
    // 登录ip
    @Column({
        name: 'login_ip',
        length: 18,
        nullable: true
    })
    loginIp: string;
    // ip 归属
    @Column({
        name: 'login_local',
        length: 20,
        nullable: true
    })
    loginLocal: string;
    // 是否手机号码登录
    @Column({
        name: 'is_mobile',
        default: false
    })
    isMobile: boolean;
    // plat_form
    @Column({
        name: 'plat_form',
        length: 14,
        nullable: true
    })
    platForm: string;
    // os
    @Column({
        name: 'os',
        length: 11,
        nullable: true
    })
    os: string;
    // 浏览器
    @Column({
        name: 'browser',
        length: 10,
        nullable: true
    })
    browser: string;
    // language
    @Column({
        name: 'language',
        length: 5,
        default: 'zh-CN'
    })
    language: string;
    // 操作时间
    @CreateDateColumn() createAt: string;
}