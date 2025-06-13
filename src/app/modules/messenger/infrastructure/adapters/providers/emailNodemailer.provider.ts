import { Injectable } from '@nestjs/common';
import { EmailOptions } from '../../../domain/models';
import { IEmailProvider } from '../../../domain/ports/providers';
import nodemailer from 'nodemailer';
import { envs } from 'src/system/configs';
import { GetSettingsSupport } from 'src/app/modules/settings/infrastructure/supports';

@Injectable()
export class EmailNodemailerProvider implements IEmailProvider {
  async send(options: EmailOptions): Promise<void> {
    const filter = {
      filter: {
        id: 'setting',
      },
    };

    const setting = await GetSettingsSupport.getSettings(filter);
    const user = setting && setting.length > 0 ? setting[0].data?.client?.email?.email : envs.messenger.email.user;
    const password = setting && setting.length > 0 ? setting[0].data?.client?.email?.pwd : envs.messenger.email.password;

    const transporter = nodemailer.createTransport({
      host: envs.messenger.email.host,
      port: 465,
      secure: true, // usa SSL para el puerto 465
      auth: {
        user: user,
        pass: password,
      },
    });

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        //console.log('Correo enviado: ' + info.response);
      }
    });
  }
}
