    export interface IPasswordHash {
     hash(password: string, saltRounds: number): Promise<string>;
     compare(password:string,hashPassword:string):Promise<boolean>
}