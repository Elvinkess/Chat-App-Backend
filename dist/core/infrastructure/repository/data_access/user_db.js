import { UserConfig } from "../config/user_config";
import { BaseDb } from "./base_db";
export class UserDb extends BaseDb {
    constructor(myDataSource) {
        super(myDataSource, UserConfig);
    }
}
