import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../domain/dto/request/jwtPayload';
import { IAuthService } from '../../usecase/interface/services/auth_service';



export class AuthService implements IAuthService{
  encryptDataUsingJWT = async (data:JwtPayload, durationInSeconds: number): Promise<string> => {

    let secret = process.env.JWT_SECRET!
    let encrypted = jwt.sign( data,secret,{ expiresIn: durationInSeconds});
      return encrypted;
  }
  decodedjwt = (token:string):JwtPayload =>{
    let secret = process.env.JWT_SECRET!
    return jwt.verify(token, secret) as JwtPayload
  }

}

