import { MessageType } from "../../../domain/dto/enums/message_type";


export type Message = {
    sender: "me" | "them";
    content: string;
    date:Date

  };
export interface ChatItem {
    id: string
    name: string
    avatarUrl?: string
    messages: Message[]
    room?: string
    type?:MessageType;
    receiverId?: number
  };


export interface ILoadChat{
    loadUserChat(userId:number):Promise<ChatItem[]>
}