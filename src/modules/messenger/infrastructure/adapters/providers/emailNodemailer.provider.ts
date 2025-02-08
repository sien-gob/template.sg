import { Injectable } from '@nestjs/common';
import { EmailOptions } from '../../../domain/models';
import { IEmailProvider } from '../../../domain/ports/providers';
import nodemailer from 'nodemailer';
import { envs } from 'src/system/configs';

@Injectable()
export class EmailNodemailerProvider implements IEmailProvider {
  async send(options: EmailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: envs.messenger.email.host,
      port: 465,
      secure: true, // usa SSL para el puerto 465
      auth: {
        user: envs.messenger.email.user,
        pass: envs.messenger.email.password,
      },
    });

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });
  }
}
