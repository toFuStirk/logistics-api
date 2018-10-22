import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
@Entity('platform_set_tabs')
export class PlatformEntity {
    @PrimaryGeneratedColumn()
    id: number;
    // 平台名称
    @Column({
        name: 'platformName',
        length: 25
    })
    platformName: string;
    // 二级名称
    @Column({
        name: 'secondaryName',
        length: 30,
        nullable: true
    })
    secondaryName: string;
    // 是否允许普通用户登录
    @Column({
        name: 'allowUserLogin',
        default: true
    })
    allowUserLogin: boolean;
    // 禁止登录提示信息
    @Column({
        name: 'promptInformation',
        type: 'text',
        nullable: true
    })
    promptInformation: string;
    // 平台代号
    @Column({
        name: 'platformCode',
        nullable: true,
        length: 20
    })
    platformCode: string;
    // 主题颜色
    @Column({
        name: 'themeColors',
        nullable: true,
        length: 60
    })
    themeColors: string;
    // 创建日期
    @CreateDateColumn()
    createAt: Date;
    // 修改日期
    @UpdateDateColumn()
    updateAt: Date;
}