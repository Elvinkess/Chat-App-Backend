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
exports.WebSocketService = void 0;
class WebSocketService {
    constructor(io, auth, messageDb, userDb) {
        this.io = io;
        this.auth = auth;
        this.messageDb = messageDb;
        this.userDb = userDb;
        this.userSocketMap = {};
        this.onConnection = (callback) => {
            this.io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
                const user = socket.handshake.auth.userId;
                let userId = parseInt(user);
                if (user) {
                    this.userSocketMap[user] = socket.id; //  Save mapping
                    console.log(`User ${user} connected with socket ID ${socket.id}`);
                    //load undelivered messages once this socket/client is connected
                    let undeliveredmessage = yield this.messageDb.get({ receiver_id: userId, delivered: false });
                    for (let message of undeliveredmessage) {
                        let sender = yield this.userDb.getOne({ id: userId });
                        if (!sender) {
                            console.warn(`Sender with ID ${message.sender_id} not found.`);
                            continue;
                        }
                        const msg = {
                            name: sender.name,
                            sender_id: message.sender_id,
                            content: message.content,
                            date: message.date,
                            type: message.type,
                        };
                        socket.emit("private-message", msg, (ack) => __awaiter(this, void 0, void 0, function* () {
                            if (ack) {
                                // if ack callback is gotten from the client as "true" update the status of the message delivery
                                yield this.messageDb.update({ id: message.id }, { delivered: true });
                            }
                        }));
                    }
                }
                socket.on("disconnect", () => {
                    if (user) {
                        delete this.userSocketMap[user]; //  Clean up
                        console.log(`User ${user} disconnected`);
                    }
                });
                callback(socket);
            }));
        };
        this.onEmit = (eventName, payload) => {
            this.io.emit(eventName, payload);
        };
        this.emitTo = (socket, eventName, payload) => {
            socket.emit(eventName, payload);
        };
        this.on = (eventName, callback) => {
            this.io.on("connection", (socket) => {
                socket.on(eventName, (payload) => {
                    callback(socket, payload);
                });
            });
        };
        this.onEmitToRoom = (room, eventName, payload) => {
            this.io.to(room).emit(eventName, payload);
        };
        this.onEmitToUser = (userId, eventName, payload, ackCallback) => {
            const socketId = this.userSocketMap[userId.toString()];
            if (socketId) {
                if (ackCallback) {
                    this.io.to(socketId).emit(eventName, payload, ackCallback); //  pass ack function
                }
                else {
                    this.io.to(socketId).emit(eventName, payload);
                }
            }
            else {
                console.log(`User ${userId} is offline or not connected`);
            }
        };
        this.onEmitToUserTyping = (userId, eventName, payload, ackCallback) => {
            const socketId = this.userSocketMap[userId.toString()];
            if (socketId) {
                if (ackCallback) {
                    this.io.to(socketId).emit(eventName, payload, ackCallback);
                }
                else {
                    this.io.to(socketId).emit(eventName, payload);
                }
            }
            else {
                console.log(`User ${userId} is offline or not connected`);
            }
        };
        this.onEmitToUserOnline = (userId, eventName, payload, ackCallback) => {
            const socketId = this.userSocketMap[userId.toString()];
            if (socketId) {
                if (ackCallback) {
                    this.io.to(socketId).emit(eventName, payload, ackCallback);
                }
                else {
                    this.io.to(socketId).emit(eventName, payload);
                }
            }
            else {
                console.log(`User ${userId} is offline or not connected`);
            }
        };
        this.getSocketIdForUser = (userId) => {
            return this.userSocketMap[userId];
        };
    }
}
exports.WebSocketService = WebSocketService;
