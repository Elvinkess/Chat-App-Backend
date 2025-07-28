import { MessageType } from "../enums/message_type";

export interface MessageDTO {
  senderId: number;
  content: string;
  type: MessageType;
  date: Date;
  receiverId?: number; // for DMs
  roomName?: string;   // for group messages
}