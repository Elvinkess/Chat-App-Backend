import { MessageType } from "../enums/message_type";

export interface IncomingMessageDTO {
    name:string
    sender_id: number;
    content: string;
    type: MessageType;
    date: Date;
    receiver_id?: number; // for DMs
    room_name?: string;   // for group messages
  }