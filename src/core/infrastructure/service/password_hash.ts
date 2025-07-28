import bcrypt from 'bcrypt';
import { IPasswordHash } from "../../usecase/interface/services/password_hash_service";
 export class HashService implements IPasswordHash{
     hash = async (password: string, saltRounds: number): Promise<string> => {
            return await bcrypt.hash(password, saltRounds);
     }

     compare =async (password: string, hashPassword: string): Promise<boolean>=> {
        return await bcrypt.compare(password, hashPassword); 
    }
     

 }