import { Socket,Server } from "socket.io";
import { IWebSocketService } from "../../usecase/interface/services/websocket_service";
import { createMessage } from "../../domain/dto/request/create_message_req";
import { IAuthService } from "../../usecase/interface/services/auth_service";
import { IMessageDb } from "../../usecase/interface/data_access/message_db";
import { message } from "../../domain/entity/message";
import { IncomingMessageDTO } from "../../domain/dto/response/incoming_messageDTO";
import { IUserDb } from "../../usecase/interface/data_access/user_db";



export class WebSocketService implements IWebSocketService {
  private userSocketMap: Record<string, string> = {}; 

  constructor(private io: Server,private auth:IAuthService,private messageDb:IMessageDb,private userDb:IUserDb) {
     
    
  }

  onConnection = (callback: (socket: Socket) => void): void => {
    this.io.on("connection", async(socket) => {
      const user = socket.handshake.auth.userId;
      let userId = parseInt(user);
      if (user) {
        this.userSocketMap[user] = socket.id; //  Save mapping
        console.log(`User ${user} connected with socket ID ${socket.id}`);

        //load undelivered messages once this socket/client is connected
        let undeliveredmessage:message[]= await this.messageDb.get({receiver_id:userId,delivered:false})
        for(let message of undeliveredmessage){
          let sender = await this.userDb.getOne({id:userId})

          if (!sender) {
            console.warn(`Sender with ID ${message.sender_id} not found.`);
            continue; 
          }

          const msg: IncomingMessageDTO = {
            name: sender.name,
            sender_id: message.sender_id,
            content: message.content,
            date: message.date,
            type: message.type,
          };

          socket.emit("private-message",msg,async(ack:boolean)=>{
            if(ack){
              // if ack callback is gotten from the client as "true" update the status of the message delivery
              await this.messageDb.update({id:message.id},{delivered:true})
            }
          })

        }
      }

      socket.on("disconnect", () => {
        if (user) {
          delete this.userSocketMap[user]; //  Clean up
          console.log(`User ${user} disconnected`);
        }
      });

      callback(socket); 
    });
  };



  onEmit=(eventName:string,payload:createMessage):void=>{
    this.io.emit(eventName,payload)
  }

  emitTo=(socket: Socket, eventName: string, payload: createMessage): void =>{
    socket.emit(eventName, payload);
  }

  on=(eventName: string, callback: (socket: Socket, payload: createMessage) => void): void=> {
    this.io.on("connection", (socket) => {
      socket.on(eventName, (payload) => {
        callback(socket, payload);
      });
    });
  }
  onEmitToRoom =(room: string, eventName: string, payload: any): void => {
    this.io.to(room).emit(eventName, payload);
  }

  onEmitToUser = (userId: string | number, eventName: string, payload: any,ackCallback?: (ack: boolean)=> void): void => {
    const socketId = this.userSocketMap[userId.toString()];
    if (socketId) {
      if (ackCallback) {
        this.io.to(socketId).emit(eventName, payload, ackCallback); //  pass ack function
      } else {
        this.io.to(socketId).emit(eventName, payload);
      }
    } else {
      console.log(`User ${userId} is offline or not connected`);
    }
  };

  onEmitToUserTyping = (userId: string | number, eventName: string, payload: any,ackCallback?: (ack: boolean)=> void): void => {
    const socketId = this.userSocketMap[userId.toString()];
    if (socketId) {
      if (ackCallback) {
        this.io.to(socketId).emit(eventName, payload, ackCallback);
      } else {
        this.io.to(socketId).emit(eventName, payload);
      }
    } else {
      console.log(`User ${userId} is offline or not connected`);
    }
  };
  onEmitToUserOnline=(userId: string | number, eventName: string, payload:{status:string,userId:number},ackCallback?: (ack: boolean)=> void):void=>{
    const socketId = this.userSocketMap[userId.toString()];
    if (socketId) {
      if (ackCallback) {
        this.io.to(socketId).emit(eventName, payload, ackCallback); 
      } else {
        this.io.to(socketId).emit(eventName, payload);
      }
    } else {
      console.log(`User ${userId} is offline or not connected`);
    }
  }

  getSocketIdForUser=(userId: string): string | undefined =>{
    return this.userSocketMap[userId];
  }
  
  
  
}












