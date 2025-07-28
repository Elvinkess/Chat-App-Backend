var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
export class AuthService {
    constructor() {
        this.encryptDataUsingJWT = (data, durationInSeconds) => __awaiter(this, void 0, void 0, function* () {
            let secret = process.env.JWT_SECRET;
            let encrypted = jwt.sign(data, secret, { expiresIn: durationInSeconds });
            return encrypted;
        });
        this.decodedjwt = (token) => {
            let secret = process.env.JWT_SECRET;
            return jwt.verify(token, secret);
        };
    }
}
