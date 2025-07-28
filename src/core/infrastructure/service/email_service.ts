import nodemailer from 'nodemailer';
import { IEmailService } from '../../usecase/interface/services/email_service';

export class EmailService implements IEmailService {
   transporter = nodemailer.createTransport({
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

   sendResetPasswordEmail = async(email: string, token: string): Promise<boolean> => {
    let resetLink = `https://localhost:${process.env.port}/user/verifyAndSet?token=${token}`;
        try {
            await this.transporter.sendMail({
                from: `"VENT APP" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Password Reset Request',
                html: `
                  <p>You requested a password reset.</p>
                  <p><a href="${resetLink}">Click here to reset your password</a></p>
                  <p>pls  ignore if you didnt request this email.</p>
                `,
              });
            return true
            }
         catch (error) {
          console.log(error)
            return false;
        }
   }
   
}
