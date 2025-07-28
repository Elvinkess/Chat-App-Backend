import { MessageType } from "../dto/enums/message_type";
import { baseEntity } from "./base_entity";

export class  message extends baseEntity{
    constructor(public  sender_id:number,public content: string,public type:MessageType,public date:Date,public delivered: boolean,public receiver_id?:number,public room_name?:string,public room_id?:string){
        super(0)
    }
}


 