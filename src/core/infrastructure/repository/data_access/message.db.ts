import { DataSource } from "typeorm";
import { MessageConfig } from "../config/message_config";
import { BaseDb } from "./base_db";
import { IMessageDb } from "../../../usecase/interface/data_access/message_db";


export  class MessageDb extends BaseDb<MessageConfig> implements IMessageDb{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, MessageConfig)
    }
    
} 