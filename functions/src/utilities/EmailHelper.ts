import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import * as functions from 'firebase-functions';

class Email {
  mailTransport: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    const userEmail = functions.config().configuration.email
    const passwordEmail = functions.config().configuration.password

    this.mailTransport = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      tls: { rejectUnauthorized: false },
      auth: {
        user: userEmail,
        pass: passwordEmail,
      },
    })
  }

  sendEmail(from: string, to: string, bcc: string, subject: string, bodyHTML: string) {
    return this.mailTransport.sendMail({
      from: from,
      to: to,
      bcc: bcc,
      subject,
      html: bodyHTML,
    });
  }
}

export default Email;