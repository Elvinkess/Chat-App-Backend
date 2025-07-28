export interface IEmailService {
    sendResetPasswordEmail(email: string, token: string): Promise<boolean>;
  }
  