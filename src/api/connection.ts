import { DataSource } from "typeorm"
import 'reflect-metadata';
import dotenv from 'dotenv';
import { UserConfig } from "../core/infrastructure/repository/config/user_config";
import { MessageConfig } from "../core/infrastructure/repository/config/message_config";


dotenv.config();
const AppDataSource = new DataSource({
    type: "postgres",
    //url: process.env.DATABASE_URL,  Required for hosted DBs like Render or Supabase
    host: "localhost",
    port: 5432,
    username: "postgres",
    password:process.env.PASSWORD,
    database: "chat  application",
    entities: [UserConfig,MessageConfig],
    synchronize: false,
    logging: false,
    // ssl: {
    //     rejectUnauthorized: false, // Required for hosted DBs like Render or Supabase
    // }
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log("database is connected boss")
    })
    .catch((error) => console.log(error))

export default AppDataSource;