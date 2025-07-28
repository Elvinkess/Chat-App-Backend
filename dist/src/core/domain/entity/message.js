"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
const base_entity_1 = require("./base_entity");
class message extends base_entity_1.baseEntity {
    constructor(sender_id, content, type, date, delivered, receiver_id, room_name, room_id) {
        super(0);
        this.sender_id = sender_id;
        this.content = content;
        this.type = type;
        this.date = date;
        this.delivered = delivered;
        this.receiver_id = receiver_id;
        this.room_name = room_name;
        this.room_id = room_id;
    }
}
exports.message = message;
