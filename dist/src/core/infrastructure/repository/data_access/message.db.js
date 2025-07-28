"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDb = void 0;
const message_config_1 = require("../config/message_config");
const base_db_1 = require("./base_db");
class MessageDb extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, message_config_1.MessageConfig);
    }
}
exports.MessageDb = MessageDb;
