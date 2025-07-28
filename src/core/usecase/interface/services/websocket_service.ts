import { Socket } from "socket.io";
import { IncomingMessageDTO } from "../../../domain/dto/response/incoming_messageDTO";

export interface IWebSocketService {
    on(eventName: string, callback: (socket: Socket, payload: any) => void): void;
    onEmit(eventName:string,payload:any):void
    onConnection(callback: (socket: Socket) => void): void;
    emitTo(socket: Socket, eventName: string, payload: any): void;
    onEmitToRoom(room: string, eventName: string, payload: any): void
    onEmitToUser(userId: string | number, eventName: string, payload:IncomingMessageDTO,ackCallback?: (ack: boolean)=> void):void
    onEmitToUserTyping(userId: string | number, eventName: string, payload:string,ackCallback?: (ack: boolean)=> void):void
    onEmitToUserOnline(userId: string | number, eventName: string, payload:{status:string,userId:number},ackCallback?: (ack: boolean)=> void):void
    getSocketIdForUser(userId: string): string | undefined 
  }

  