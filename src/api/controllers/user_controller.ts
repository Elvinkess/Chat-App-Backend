import { resetReq } from "../../core/domain/dto/request/reset_password_req";
import { SignInUserReq } from "../../core/domain/dto/request/user_sign_in_req";
import { verifyPasswordReq } from "../../core/domain/dto/request/verify_password_req";
import { user } from "../../core/domain/entity/user";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import express, { Request,Response,NextFunction } from "express"

export class UserController{
    constructor(private userLogic:IUserLogic){}
    create =  async(req : Request<{}, {}, user>, res: Response, next: NextFunction)=>{
        try {
            
            

            let user = await this.userLogic.create(req.body);
            res.json(user);
            
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }
    signin =  async(req : Request<{}, {}, SignInUserReq>, res: Response, next: NextFunction)=>{
        try {
            

            let user = await this.userLogic.signInUser(req.body);
            res.json(user);
            
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }
    resetPassword =  async(req : Request<{}, {}, resetReq>, res: Response, next: NextFunction)=>{
        try {
            console.log(req.body)

            let resetRes = await this.userLogic.resetpassword(req.body);
            res.json(resetRes);
            
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }

    verifyAndResetPassowrd =  async(req : Request<{}, {}, verifyPasswordReq,{token:string}>, res: Response, next: NextFunction)=>{
        try {
            let token = req.query.token
          

            let reset = await this.userLogic.verifytoken(token,req.body);
            res.json(reset);
            
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }
    getUser = async(req : Request<{userId:string}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let email = req.params.userId
            let user = await this.userLogic.getUser(email)
            res.json(user)
            
        } catch (err) {
            res.status(400).json({ error: (err as Error).message }); 
            
        }
    }
}