"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userLogic) {
        this.userLogic = userLogic;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userLogic.create(req.body);
                res.json(user);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.signin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userLogic.signInUser(req.body);
                res.json(user);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                let resetRes = yield this.userLogic.resetpassword(req.body);
                res.json(resetRes);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.verifyAndResetPassowrd = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.query.token;
                let reset = yield this.userLogic.verifytoken(token, req.body);
                res.json(reset);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.params.userId;
                let user = yield this.userLogic.getUser(email);
                res.json(user);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.UserController = UserController;
