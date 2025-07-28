import { JwtPayload } from "../../../domain/dto/request/jwtPayload";

export interface IAuthService{
    encryptDataUsingJWT  (data:JwtPayload, durationInSeconds: number): Promise<string> 
    decodedjwt (token:string):JwtPayload 
}