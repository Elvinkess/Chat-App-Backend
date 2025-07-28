import { MessageType } from "../enums/message_type"

export interface ItypingPayload{
    senderId:string
    email:string
    receiverId:number | null
    room:string | null
    type:MessageType
}