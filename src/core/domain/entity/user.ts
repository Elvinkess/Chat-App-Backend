import { baseEntity } from "./base_entity";

export class user extends baseEntity{
 constructor(public name:string,public email:string,public password:string,public reset_token?: string| null,public token_expiration?:Date | null){
     super(0);
 }
}