import { MessageType } from "../../domain/dto/enums/message_type";
import { createMessage } from "../../domain/dto/request/create_message_req";
import { MessageDTO } from "../../domain/dto/request/messageDTO";
import { ItypingPayload } from "../../domain/dto/request/on_typing_request";
import {   IJoinRoomPayload } from "../../domain/dto/request/private_chat_payload";
import { IGroupChat } from "../../domain/dto/request/room_message_payload";
import { IncomingMessageDTO } from "../../domain/dto/response/incoming_messageDTO";
import { message } from "../../domain/entity/message";
import { IMessageDb } from "../interface/data_access/message_db";
import { IUserDb } from "../interface/data_access/user_db";
import { IMessageLogic } from "../interface/logic/message_logic";
import { IWebSocketService } from "../interface/services/websocket_service";

export class MessageLogic implements IMessageLogic{
    constructor(private messageDb:IMessageDb, public webSocket:IWebSocketService,public user:IUserDb){}
    setup(): void {
        this.webSocket.onConnection((socket) => {
            // console.log(`${socket.id} connected`);
            // console.log(socket.handshake.auth)
            console.log("📡 Socket connected:", socket.id)
          

  console.log("🧠 MessageLogic.setup() called");
            socket.onAny((event, ...args) => {
              console.log(`📡 Received event: ${event}`, args);
            });
           
            

            //global chat to every persons connected to the server
            socket.on("chat_message",(payload:MessageDTO) => {
              console.log(`Message:`, payload);
              this.webSocket.onEmit( "chat_message", payload);
            });



            //To join or create a room,users emit the "join-group" event name with their payload 
            socket.on("join-group",(payload: IJoinRoomPayload)=>{
                socket.join(payload.room)

                console.log('the room name is: ',payload.room)
                console.log(payload)

                // sends this message to this particular socket client  also  user listens with socket.on() in there frontend for this event
                socket.emit("join-group-success", {
                    room: payload.room,
                    message: ` You have joined ${payload.room} successfully.`
                });
                console.log(socket.id + `you have  successfuly join the ${payload.room} group`)

                //send payload/chat to every user in this group/room
                socket.to(payload.room).emit("user-joined", payload);

            })
            // listen to this event  'room-message' and react
            socket.on("group-message",async(payload:MessageDTO)=>{
              console.log('group message from socketID: ' + socket.id,payload.content)
              let chat = new message(payload.senderId,payload.content,payload.type,payload.date,true,payload.receiverId,payload.roomName)
              await this.messageDb.save(chat)
              socket.to(payload.roomName!).emit("group-message", payload); // everyone except the sender

              //this.webSocket.onEmitToRoom(payload.roomName!,"group-message",payload)  send to everyone including the sender
            })



            socket.on("private-message", async (payload: MessageDTO) => {
              try {
                let receiverId = payload.receiverId; // userId of the recipient
                let senderId = payload.senderId;
                if (!receiverId || !senderId) return;

              let msg = new message(senderId, payload.content, payload.type, payload.date, false,receiverId);
              let savedMessage=await this.messageDb.save(msg);
              console.log(savedMessage)

              let receiverSocketId = this.webSocket.getSocketIdForUser?.(receiverId.toString());
              let user = await this.user.getOne({id:senderId})
              let outMessage:IncomingMessageDTO ={name:user?.name!,sender_id:senderId,content:payload.content,type:payload.type,date:payload.date}

              if(receiverSocketId){
              this.webSocket.onEmitToUser((receiverId!).toString() , "private-message", outMessage,async(deliveredAck: boolean)=>{
                if(deliveredAck){
                  await this.messageDb.update({id:savedMessage.id},{delivered:true})
                  
                }
              });
              }
              } catch (error) {
                console.error("Error handling private-message event:", error);
              }
            });

            //Listen if chat mates are online

            socket.on("online-status",async(userId:number)=>{
              console.log("Received 'online-status' for user:", userId);

              let chats =  await this.messageDb.getOr([{sender_id:userId},{receiver_id:userId}])

              let otherChatIds = new Set<number>();
              
              for(let chat of chats){
                let otheruserId = chat.sender_id === userId ? chat.receiver_id : chat.sender_id
                if(otheruserId){otherChatIds.add(otheruserId)}
              }
              for (let otherUserId of otherChatIds){
                let socketId = this.webSocket.getSocketIdForUser(otherUserId.toString())
                console.log(`👥 Looking for socket of ${otherUserId}`, socketId);

                if(socketId){
                   this.webSocket.onEmitToUserOnline(socketId,"on-line",{status:"online",userId:userId})
                }

              }

            })



            //Listen to user typing
            socket.on("Typing",async(payload:ItypingPayload)=>{
              
              console.log(payload)
              console.log(typeof(payload.senderId))

              if (payload.type === MessageType.DIRECT && payload.receiverId) {
                const receiverSocketId =  this.webSocket.getSocketIdForUser((payload.receiverId).toString())
                if (receiverSocketId) {
                  this.webSocket.onEmitToUserTyping(payload.receiverId.toString(),"Typing",payload.name)
                }
              } else if (payload.type === MessageType.GROUP && payload.room) {
                this.webSocket.onEmitToRoom(payload.room,"Typing",parseInt(payload.name))
              }

            })
            




          });

          

        }
}






