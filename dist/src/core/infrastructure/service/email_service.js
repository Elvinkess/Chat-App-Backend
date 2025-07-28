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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.sendResetPasswordEmail = (email, token) => __awaiter(this, void 0, void 0, function* () {
            let resetLink = `https://localhost:${process.env.port}/user/verifyAndSet?token=${token}`;
            try {
                yield this.transporter.sendMail({
                    from: `"VENT APP" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Password Reset Request',
                    html: `
                  <p>You requested a password reset.</p>
                  <p><a href="${resetLink}">Click here to reset your password</a></p>
                  <p>pls  ignore if you didnt request this email.</p>
                `,
                });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.EmailService = EmailService;
