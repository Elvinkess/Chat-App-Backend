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
exports.MessageLogic = void 0;
const message_type_1 = require("../../domain/dto/enums/message_type");
const message_1 = require("../../domain/entity/message");
class MessageLogic {
    constructor(messageDb, webSocket, user) {
        this.messageDb = messageDb;
        this.webSocket = webSocket;
        this.user = user;
    }
    setup() {
        this.webSocket.onConnection((socket) => {
            // console.log(`${socket.id} connected`);
            // console.log(socket.handshake.auth)
            console.log("📡 Socket connected:", socket.id);
            console.log("🧠 MessageLogic.setup() called");
            socket.onAny((event, ...args) => {
                console.log(`📡 Received event: ${event}`, args);
            });
            //global chat to every persons connected to the server
            socket.on("chat_message", (payload) => {
                console.log(`Message:`, payload);
                this.webSocket.onEmit("chat_message", payload);
            });
            //To join or create a room,users emit the "join-group" event name with their payload 
            socket.on("join-group", (payload) => {
                socket.join(payload.room);
                console.log('the room name is: ', payload.room);
                console.log(payload);
                // sends this message to this particular socket client  also  user listens with socket.on() in there frontend for this event
                socket.emit("join-group-success", {
                    room: payload.room,
                    message: ` You have joined ${payload.room} successfully.`
                });
                console.log(socket.id + `you have  successfuly join the ${payload.room} group`);
                //send payload/chat to every user in this group/room
                socket.to(payload.room).emit("user-joined", payload);
            });
            // listen to this event  'room-message' and react
            socket.on("group-message", (payload) => __awaiter(this, void 0, void 0, function* () {
                console.log('group message from socketID: ' + socket.id, payload.content);
                let chat = new message_1.message(payload.senderId, payload.content, payload.type, payload.date, true, payload.receiverId, payload.roomName);
                yield this.messageDb.save(chat);
                socket.to(payload.roomName).emit("group-message", payload); // everyone except the sender
                //this.webSocket.onEmitToRoom(payload.roomName!,"group-message",payload)  send to everyone including the sender
            }));
            socket.on("private-message", (payload) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    let receiverId = payload.receiverId; // userId of the recipient
                    let senderId = payload.senderId;
                    if (!receiverId || !senderId)
                        return;
                    let msg = new message_1.message(senderId, payload.content, payload.type, payload.date, false, receiverId);
                    let savedMessage = yield this.messageDb.save(msg);
                    console.log(savedMessage);
                    let receiverSocketId = (_b = (_a = this.webSocket).getSocketIdForUser) === null || _b === void 0 ? void 0 : _b.call(_a, receiverId.toString());
                    let user = yield this.user.getOne({ id: senderId });
                    let outMessage = { name: user === null || user === void 0 ? void 0 : user.name, sender_id: senderId, content: payload.content, type: payload.type, date: payload.date };
                    if (receiverSocketId) {
                        this.webSocket.onEmitToUser((receiverId).toString(), "private-message", outMessage, (deliveredAck) => __awaiter(this, void 0, void 0, function* () {
                            if (deliveredAck) {
                                yield this.messageDb.update({ id: savedMessage.id }, { delivered: true });
                            }
                        }));
                    }
                }
                catch (error) {
                    console.error("Error handling private-message event:", error);
                }
            }));
            //Listen if chat mates are online
            socket.on("online-status", (userId) => __awaiter(this, void 0, void 0, function* () {
                console.log("Received 'online-status' for user:", userId);
                let chats = yield this.messageDb.getOr([{ sender_id: userId }, { receiver_id: userId }]);
                let otherChatIds = new Set();
                for (let chat of chats) {
                    let otheruserId = chat.sender_id === userId ? chat.receiver_id : chat.sender_id;
                    if (otheruserId) {
                        otherChatIds.add(otheruserId);
                    }
                }
                for (let otherUserId of otherChatIds) {
                    let socketId = this.webSocket.getSocketIdForUser(otherUserId.toString());
                    console.log(`👥 Looking for socket of ${otherUserId}`, socketId);
                    if (socketId) {
                        this.webSocket.onEmitToUserOnline(socketId, "on-line", { status: "online", userId: userId });
                    }
                }
            }));
            //Listen to user typing
            socket.on("Typing", (payload) => __awaiter(this, void 0, void 0, function* () {
                console.log(payload);
                console.log(typeof (payload.senderId));
                if (payload.type === message_type_1.MessageType.DIRECT && payload.receiverId) {
                    const receiverSocketId = this.webSocket.getSocketIdForUser((payload.receiverId).toString());
                    if (receiverSocketId) {
                        this.webSocket.onEmitToUserTyping(payload.receiverId.toString(), "Typing", payload.senderId);
                    }
                }
                else if (payload.type === message_type_1.MessageType.GROUP && payload.room) {
                    this.webSocket.onEmitToRoom(payload.room, "Typing", parseInt(payload.senderId));
                }
            }));
        });
    }
}
exports.MessageLogic = MessageLogic;
