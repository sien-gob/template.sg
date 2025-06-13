import { Inject, Injectable } from '@nestjs/common';
import { IEmailProvider } from '../../domain/ports/providers';
import { EmailOptions } from '../../domain/models';
import { envs } from 'src/system/configs';

type TemplateType = 'REGISTER' | 'PASSWORD_RECOVERY';

@Injectable()
export class NotifyRegByEmailService {
  constructor(
    @Inject('IEmailProvider')
    private readonly emailProvider: IEmailProvider,
  ) {}

  private getTemplateUserRegister(nickname: string, password: string) {
    return `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Código de Seguridad</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- Header con Logo -->
                        <!-- Contenido Principal -->
                        <div style="padding: 40px 20px; background-color: #ffffff;">
                            <h1 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">
                                Bienvenido, ${nickname}
                            </h1>

                            <p style="color: #34495e; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                                Gracias por registrarte en App Ejecutiva. Para completar tu acceso, utiliza el siguiente código de seguridad:
                            </p>

                            <!-- Código de Seguridad -->
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
                                <p style="font-size: 32px; font-weight: bold; color: #2c3e50; margin: 0; letter-spacing: 5px;">
                                    ${password}
                                </p>
                            </div>
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 30px;">
                                <p style="color: #856404; margin: 0; font-size: 14px;">
                                    Si no solicitaste este código, puedes ignorar este mensaje. Es posible que alguien haya ingresado tu dirección de correo electrónico por error.
                                </p>
                            </div>

                            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
                                Este es un correo electrónico automático, por favor no responda a este mensaje.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; padding: 20px; background-color: #2c3e50;">
                            <p style="color: #ffffff; font-size: 14px; margin: 0;">
                                © 2025 App Ejecutiva. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
      `;
  }

  private getTemplatePasswordRecoveryRegister(nickname: string, password: string) {
    return `
         <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nueva Contraseña</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <!-- Header con Logo -->

                    <!-- Contenido Principal -->
                    <div style="padding: 40px 20px; background-color: #ffffff;">
                        <h1 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">
                            Hola, ${nickname}
                        </h1>

                        <p style="color: #34495e; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                            Tu contraseña ha sido restablecida exitosamente. Para acceder a App Ejecutiva, 
                            utiliza la siguiente contraseña temporal:
                        </p>

                        <!-- Nueva Contraseña -->
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
                            <p style="font-size: 32px; font-weight: bold; color: #2c3e50; margin: 0; letter-spacing: 5px;">
                                ${password}
                            </p>
                        </div>

                        <!-- Recomendación de Seguridad -->
                        <div style="background-color: #e8f4fe; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                            <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                                Importante:
                            </h2>
                            <ul style="color: #34495e; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                <li>Por seguridad, te recomendamos cambiar esta contraseña temporal después de tu primer inicio de sesión</li>
                                <li>Mantén tu contraseña en un lugar seguro</li>
                                <li>No compartas tu contraseña con nadie</li>
                            </ul>
                        </div>

                        <!-- Advertencia de Seguridad -->
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 30px;">
                            <p style="color: #856404; margin: 0; font-size: 14px;">
                                Si no solicitaste este cambio de contraseña, por favor contacta inmediatamente 
                                con nuestro equipo de soporte, ya que esto podría indicar que alguien está 
                                intentando acceder a tu cuenta.
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; padding: 20px; background-color: #2c3e50;">
                        <p style="color: #ffffff; font-size: 14px; margin: 0;">
                            © 2025 App Ejecutiva. Todos los derechos reservados.
                        </p>
                        <p style="color: #ffffff; font-size: 12px; margin-top: 10px;">
                            Este es un correo electrónico automático, por favor no responda a este mensaje.
                        </p>
                    </div>
                </div>
            </body>
            </html>
      `;
  }

  async run(template: TemplateType, to: string, password: string, nickname: string) {
    /*
      <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa;">
        <img src="[URL_DE_TU_LOGO]" alt="App Ejecutiva Logo" style="max-height: 60px;">
      </div>
    */

    const selectedTemplates: { [key in TemplateType]: () => string } = {
      REGISTER: () => this.getTemplateUserRegister(nickname, password),
      PASSWORD_RECOVERY: () => this.getTemplatePasswordRecoveryRegister(nickname, password),
    };

    const htmlContent = selectedTemplates[template]();

    const options: EmailOptions = {
      from: `"Servicio de App Ejecutiva" <${envs.messenger.email.from}>`,
      to: to,
      subject: 'Código de seguridad de acceso App Ejecutiva',
      html: htmlContent,
    };

    await this.emailProvider.send(options);
  }
}
