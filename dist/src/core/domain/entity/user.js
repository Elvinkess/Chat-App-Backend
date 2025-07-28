"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const base_entity_1 = require("./base_entity");
class user extends base_entity_1.baseEntity {
    constructor(name, email, password, reset_token, token_expiration) {
        super(0);
        this.name = name;
        this.email = email;
        this.password = password;
        this.reset_token = reset_token;
        this.token_expiration = token_expiration;
    }
}
exports.user = user;
