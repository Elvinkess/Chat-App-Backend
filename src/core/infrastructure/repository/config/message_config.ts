import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { message } from "../../../domain/entity/message"
import { MessageType } from "../../../domain/dto/enums/message_type"


@Entity("message")
export class MessageConfig extends BaseEntity  implements message {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    sender_id!:number

    @Column()
    content!:string

    @Column()
    date!:Date

    @Column()
    type!:MessageType

    @Column({ default: false })
    delivered!: boolean;

    @Column()
    receiver_id?:number

    @Column()
    room_name?:string

    @Column()
    room_id?:string

    


}