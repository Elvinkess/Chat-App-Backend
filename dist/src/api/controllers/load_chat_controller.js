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
exports.LoadChatController = void 0;
class LoadChatController {
    constructor(loadChatLogic) {
        this.loadChatLogic = loadChatLogic;
        this.loadChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized: user not found" });
                }
                let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                let loadChat = yield this.loadChatLogic.loadUserChat(userId);
                res.json(loadChat);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.LoadChatController = LoadChatController;
