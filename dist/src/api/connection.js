"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const user_config_1 = require("../core/infrastructure/repository/config/user_config");
const message_config_1 = require("../core/infrastructure/repository/config/message_config");
dotenv_1.default.config();
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    //url: process.env.DATABASE_URL,  Required for hosted DBs like Render or Supabase
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.PASSWORD,
    database: "chat  application",
    entities: [user_config_1.UserConfig, message_config_1.MessageConfig],
    synchronize: false,
    logging: false,
    // ssl: {
    //     rejectUnauthorized: false, // Required for hosted DBs like Render or Supabase
    // }
});
AppDataSource.initialize()
    .then(() => {
    // here you can start to work with your database
    console.log("database is connected boss");
})
    .catch((error) => console.log(error));
exports.default = AppDataSource;
