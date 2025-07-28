var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from 'crypto';
export class UserLogic {
    constructor(userDb, hashpassword, auth, emailService) {
        this.userDb = userDb;
        this.hashpassword = hashpassword;
        this.auth = auth;
        this.emailService = emailService;
        this.create = (user) => __awaiter(this, void 0, void 0, function* () {
            let userExist = yield this.userDb.getOne({ email: user.email });
            if (userExist) {
                throw new Error(`User with this email : ${user.email} exist`);
            }
            let hashPassword = yield this.hashpassword.hash(user.password, 10);
            user.password = hashPassword;
            let newUser = yield this.userDb.save(user);
            return newUser;
        });
        this.signInUser = (signInDTO) => __awaiter(this, void 0, void 0, function* () {
            let userExist = yield this.userDb.getOne({ email: signInDTO.email });
            if (!userExist) {
                throw new Error(`there is  no user with this email : ${signInDTO.email} exist`);
            }
            let validPassword = yield this.hashpassword.compare(signInDTO.password, userExist.password);
            if (!validPassword) {
                throw new Error("Password is Incorrect");
            }
            let encryptData = {
                name: userExist.name,
                email: userExist.email
            };
            let timeInSec = 3600;
            let encryptDataUsingJWT = yield this.auth.encryptDataUsingJWT(encryptData, timeInSec);
            return {
                name: userExist.name,
                email: userExist.email,
                token: encryptDataUsingJWT,
                expirationInSeconds: timeInSec
            };
        });
        this.generateResetToken = () => {
            return crypto.randomBytes(32).toString('hex');
        };
        this.resetpassword = (verifyReq) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userDb.getOne({ email: verifyReq.email });
            if (!user) {
                throw new Error(`User with this email : ${verifyReq.email} does not exist`);
            }
            let token = this.generateResetToken();
            let nowInSeconds = Math.floor(Date.now() / 1000);
            let expiresIn = 10 * 60; // 10 minutes in seconds
            let expiryTime = nowInSeconds + expiresIn;
            let expireDate = new Date(expiryTime * 1000);
            console.log(expireDate);
            let emailSent = yield this.emailService.sendResetPasswordEmail(verifyReq.email, token);
            if (emailSent === false) {
                throw new Error("Sorry couldn't send verifyReq token");
            }
            yield this.userDb.update({ id: user.id }, { token_expiration: expireDate, reset_token: token });
            return ("you be redirected to the  verifytoken endpoint");
        });
        this.verifytoken = (token, verifyReq) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userDb.getOne({ reset_token: token });
            if (!user) {
                throw new Error("Token invalid");
            }
            let nowInSeconds = Math.floor(Date.now() / 1000);
            let currentDate = new Date(nowInSeconds * 1000);
            if ((user === null || user === void 0 ? void 0 : user.token_expiration) < currentDate) {
                throw new Error("Token has expire");
            }
            if (verifyReq.newPassword !== verifyReq.confirmPassword) {
                throw new Error(`Pls confirm your new pass to be the same as your comfirm verifyReq`);
            }
            let newPassword = yield this.hashpassword.hash(verifyReq.confirmPassword, 10);
            user.password = newPassword;
            user.reset_token = undefined;
            user.token_expiration = undefined;
            yield this.userDb.save(user);
            return ("passowrd successfully changed");
        });
    }
    decodedjwt(token) {
        throw new Error("Method not implemented.");
    }
}
