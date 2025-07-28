import { MessageType } from "../../domain/dto/enums/message_type";
import { IMessageDb } from "../interface/data_access/message_db";
import { IUserDb } from "../interface/data_access/user_db";
import { ChatItem, ILoadChat } from "../interface/logic/load_chat_logic";

export class LoadChatLogic implements  ILoadChat{
    constructor(private userdb:IUserDb,private messagedb:IMessageDb){}
    loadUserChat = async(userId: number): Promise <ChatItem[]> =>{
    
        let messages = await this.messagedb.getOr([{sender_id:userId},{receiver_id:userId}])

        let chatMap = new Map<string,ChatItem>()
        for(let message of messages){
            let chatId:string
            let chatName:string
            let avatarUrl:string
            let otherUserId:number | undefined

            if(message.type === MessageType.DIRECT){
                otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
                chatId = `direct-${otherUserId}`
                if (!chatMap.has(chatId)) {
                    let otherUser = await this.userdb.getOne({id:otherUserId})
                    chatName = otherUser?.name ?? `User ${otherUserId}`;
                    avatarUrl = `https://i.pravatar.cc/100?u=user-${otherUserId}`;
                    chatMap.set(chatId, {
                      id: chatId,
                      name: chatName,
                      avatarUrl,
                      receiverId: otherUserId,
                      type: MessageType.DIRECT,
                      messages: []
                    });
                }
                const messageSender = message.receiver_id === otherUserId ? "them" : "me";

                let chat = chatMap.get(chatId)
                if(chat){
                    chat.messages.push({
                        sender: messageSender,
                        content: message.content,
                        date: message.date,
                    });
                }
                
               
            }
        }
        const chats:ChatItem[] = Array.from(chatMap.values());
        return chats     
    }

}
 




