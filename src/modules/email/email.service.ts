import { Injectable } from '@nestjs/common';
import { EmailType } from './email.type';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceKeys } from '../../common/constants';

@Injectable()
export class EmailService {
  private sendGridMail;
  private sendGridApiKey: string;
  private sendGridFromEmail: string;
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(
      configService.get<string>(ConfigServiceKeys.SENDGRID_API_KEY),
    );
    this.sendGridMail = sgMail;
    this.sendGridApiKey = configService.get<string>(
      ConfigServiceKeys.SENDGRID_API_KEY,
    );
    this.sendGridFromEmail = configService.get<string>(
      ConfigServiceKeys.SENDGRID_FROM_EMAIL,
    );
  }

  private async send(payload: EmailType) {
    const msg: any = {
      from: this.sendGridFromEmail,
      to: payload.to,
      subject: payload.subject,
      template: payload.template,
      html: payload.html,
      text: payload.text,
    };
    return this.sendGridMail
      .send(msg)
      .then(() => console.log(`Email sent to ${payload.to}`))
      .catch((error) =>
        console.log('Error sending email', JSON.stringify(error, null, 4)),
      );
  }

  sendTextEmail(payload: EmailType): void {
    this.send(payload);
  }

  sendEmail(mailData: Omit<sgMail.MailDataRequired, 'from'>) {
    if (!this.sendGridFromEmail) {
      console.error('SENDGRID_FROM_EMAIL is not defined');
    }

    if (!this.sendGridApiKey) {
      console.error('SENDGRID_API_KEY is not defined');
    }

    const mailPayload: Partial<sgMail.MailDataRequired> = {
      ...mailData,
      from: {
        name: process.env.SENDGRID_FROM_NAME,
        email: process.env.SENDGRID_FROM_EMAIL,
      },
    };

    return this.sendGridMail
      .send(mailPayload)
      .then(() => console.log(`Email sent to ${mailData.to}`))
      .catch((error) =>
        console.log('Error sending email', JSON.stringify(error, null, 4)),
      );
  }
}
