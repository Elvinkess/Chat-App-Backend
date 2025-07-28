"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogic = exports.emailService = exports.auth = exports.hashpassword = exports.messageDb = exports.userDb = void 0;
const message_db_1 = require("../core/infrastructure/repository/data_access/message.db");
const user_db_1 = require("../core/infrastructure/repository/data_access/user_db");
const auth_service_1 = require("../core/infrastructure/service/auth_service");
const email_service_1 = require("../core/infrastructure/service/email_service");
const password_hash_1 = require("../core/infrastructure/service/password_hash");
const user_logic_implementation_1 = require("../core/usecase/logic/user_logic_implementation");
const connection_1 = __importDefault(require("./connection"));
exports.userDb = new user_db_1.UserDb(connection_1.default);
exports.messageDb = new message_db_1.MessageDb(connection_1.default);
exports.hashpassword = new password_hash_1.HashService();
exports.auth = new auth_service_1.AuthService();
exports.emailService = new email_service_1.EmailService();
exports.userLogic = new user_logic_implementation_1.UserLogic(exports.userDb, exports.hashpassword, exports.auth, exports.emailService);
