"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadChatLogic = void 0;
const message_type_1 = require("../../domain/dto/enums/message_type");
class LoadChatLogic {
    constructor(userdb, messagedb) {
        this.userdb = userdb;
        this.messagedb = messagedb;
        this.loadUserChat = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let messages = yield this.messagedb.getOr([{ sender_id: userId }, { receiver_id: userId }]);
            let chatMap = new Map();
            for (let message of messages) {
                let chatId;
                let chatName;
                let avatarUrl;
                let otherUserId;
                if (message.type === message_type_1.MessageType.DIRECT) {
                    otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
                    chatId = `direct-${otherUserId}`;
                    if (!chatMap.has(chatId)) {
                        let otherUser = yield this.userdb.getOne({ id: otherUserId });
                        chatName = (_a = otherUser === null || otherUser === void 0 ? void 0 : otherUser.name) !== null && _a !== void 0 ? _a : `User ${otherUserId}`;
                        avatarUrl = `https://i.pravatar.cc/100?u=user-${otherUserId}`;
                        chatMap.set(chatId, {
                            id: chatId,
                            name: chatName,
                            avatarUrl,
                            receiverId: otherUserId,
                            type: message_type_1.MessageType.DIRECT,
                            messages: []
                        });
                    }
                    const messageSender = message.receiver_id === otherUserId ? "them" : "me";
                    let chat = chatMap.get(chatId);
                    if (chat) {
                        chat.messages.push({
                            sender: messageSender,
                            content: message.content,
                            date: message.date,
                        });
                    }
                }
            }
            const chats = Array.from(chatMap.values());
            return chats;
        });
    }
}
exports.LoadChatLogic = LoadChatLogic;
