import { RequestHandler, Router } from "express";
import { LoadChatController } from "../controllers/load_chat_controller";
import { ILoadChat } from "../../core/usecase/interface/logic/load_chat_logic";
import { LoadChatLogic } from "../../core/usecase/logic/load_chat_logic_implementation";
import { messageDb, userDb } from "../programs";
import { AuthMiddleware } from "../middlewares/auth_middleware";
import { IAuthService } from "../../core/usecase/interface/services/auth_service";
import { AuthService } from "../../core/infrastructure/service/auth_service";


let loadChatRoute = Router();
let authService:IAuthService = new AuthService
let authMiddleware = new AuthMiddleware(authService)
let loadChatLogic:ILoadChat = new LoadChatLogic(userDb,messageDb)
let loadChatController = new LoadChatController(loadChatLogic)
loadChatRoute.get("/",authMiddleware.authenticateJWT,loadChatController.loadChat as RequestHandler)

export default loadChatRoute