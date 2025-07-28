import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { user } from "../../../domain/entity/user";

@Entity("users")
export class UserConfig extends BaseEntity  implements user {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string 

    @Column()
    reset_token?: string 

    @Column()
    token_expiration?: Date

}