import { Request,Response,NextFunction } from "express";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { IAuthService } from "../../core/usecase/interface/services/auth_service";

export interface AuthRequest extends Request {
    user?: {name: string; email: string,id:number}
}


export class AuthMiddleware{
    constructor(public auth:IAuthService){}    
     authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) :Promise<any> => {
      let token = req.header("Authorization")?.split(" ")[1];
    
      if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
      }
    
      try {
        const decoded = this.auth.decodedjwt(token);
        req.user = decoded;
         
        next();
      } catch (err) {
        res.status(403).json({ message: "Invalid token" });
      }
    };
}