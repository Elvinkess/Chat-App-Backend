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
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(auth) {
        this.auth = auth;
        this.authenticateJWT = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Access token is missing" });
            }
            try {
                const decoded = this.auth.decodedjwt(token);
                req.user = decoded;
                next();
            }
            catch (err) {
                res.status(403).json({ message: "Invalid token" });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
