import { baseEntity } from "./base_entity";
export class user extends baseEntity {
    constructor(name, email, password, reset_token, token_expiration) {
        super(0);
        this.name = name;
        this.email = email;
        this.password = password;
        this.reset_token = reset_token;
        this.token_expiration = token_expiration;
    }
}
