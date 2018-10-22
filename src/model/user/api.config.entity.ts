import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
@Entity('api-config-key')
export class ApiConfigEntity {
   @PrimaryGeneratedColumn()
    id: number;
   @Column({
       name: 'jdapikey',
       length: 40
   })
   jdapikey: string;
   @CreateDateColumn()
    createAt: Date;
   @UpdateDateColumn()
    updateAt: Date;
}