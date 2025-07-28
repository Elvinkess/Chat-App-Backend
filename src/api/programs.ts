import { MessageDb } from "../core/infrastructure/repository/data_access/message.db";
import { UserDb } from "../core/infrastructure/repository/data_access/user_db";
import { AuthService } from "../core/infrastructure/service/auth_service";
import { EmailService } from "../core/infrastructure/service/email_service";
import { HashService } from "../core/infrastructure/service/password_hash";
import { IMessageDb } from "../core/usecase/interface/data_access/message_db";
import { IUserDb } from "../core/usecase/interface/data_access/user_db";
import { IUserLogic } from "../core/usecase/interface/logic/user_logic";
import { IAuthService } from "../core/usecase/interface/services/auth_service";
import { IEmailService } from "../core/usecase/interface/services/email_service";
import { IPasswordHash } from "../core/usecase/interface/services/password_hash_service";
import { UserLogic } from "../core/usecase/logic/user_logic_implementation";
import AppDataSource from "./connection";


export let userDb: IUserDb = new UserDb(AppDataSource);
export let messageDb:IMessageDb = new MessageDb(AppDataSource);

export let hashpassword:IPasswordHash = new HashService()
export let auth:IAuthService = new AuthService()
export let emailService:IEmailService = new EmailService()

export  let userLogic: IUserLogic = new UserLogic(userDb,hashpassword,auth,emailService);


