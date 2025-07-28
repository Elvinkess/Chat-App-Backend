import { Request,Response,NextFunction } from "express";
import { ILoadChat } from "../../core/usecase/interface/logic/load_chat_logic";
import { AuthRequest } from "../middlewares/auth_middleware";




export class LoadChatController{
    constructor(private loadChatLogic:ILoadChat){}
    loadChat = async(req : AuthRequest, res: Response, next: NextFunction)=>{
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized: user not found" });
              }
              
            let userId = req.user?.id
            let loadChat = await this.loadChatLogic.loadUserChat(userId);
            res.json(loadChat);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }

    }
}