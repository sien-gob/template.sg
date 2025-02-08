import { Inject, Injectable } from '@nestjs/common';
import { IEmailProvider } from '../../domain/ports/providers';
import { EmailOptions } from '../../domain/models';
import { envs } from 'src/system/configs';
import { ErrorMessageEmailDto } from '../../domain/dtos';
import { format } from 'date-fns';

type TemplateType = 'ERROR';

@Injectable()
export class NotifyErrorByEmailService {
  constructor(
    @Inject('IEmailProvider')
    private readonly emailProvider: IEmailProvider,
  ) {}

  private getTemplateError(inputs: ErrorMessageEmailDto) {
    const { errorCode, errorLocation, errorMessage, receptor, timestamp } = inputs;
    return `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Notificación de Error</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                            background-color: #121212;
                            color: #e0e0e0;
                        }
                    </style>
                </head>
                <body>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- Contenido Principal -->
                        <div style="padding: 40px 20px; background-color: #1e1e1e;">
                            <h1 style="color: #4db8ff; margin-bottom: 20px; font-size: 24px;">
                                Hola, ${receptor}
                            </h1>

                            <div style="background-color: #2a2a2a; border-left: 4px solid #ff4d4d; padding: 20px; margin-bottom: 30px;">
                                <h2 style="color: #ff4d4d; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                                    Error Detectado
                                </h2>
                                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                    ${errorMessage}
                                </p>
                            </div>

                            <!-- Detalles del Error -->
                            <div style="background-color: #2c2c2c; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <h3 style="color: #4db8ff; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
                                    Detalles Técnicos:
                                </h3>
                                <p style="color: #b0b0b0; font-size: 14px; line-height: 1.5; margin: 0;">
                                    Código de Error: ${errorCode}<br>
                                    Fecha y Hora: ${timestamp}<br>
                                    Ubicación: ${errorLocation}
                                </p>
                            </div>

                            <!-- Acciones Recomendadas -->
                            <div style="background-color: #252525; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <h2 style="color: #4db8ff; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                                    Acciones Recomendadas:
                                </h2>
                                <ul style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Revise los detalles del error</li>
                                    <li>Contacte al soporte técnico si el problema persiste</li>
                                    <li>Proporcione los detalles técnicos al equipo de soporte</li>
                                </ul>
                            </div>

                            <!-- Contacto de Soporte -->
                            <div style="background-color: #2a2a2a; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 30px;">
                                <p style="color: #b0b0b0; margin: 0; font-size: 14px;">
                                    Si necesita ayuda, contáctenos a:
                                    <br>soporte@appejecutiva.com
                                    <br>Teléfono: +XX XXX XXX XXX
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="text-align: center; padding: 20px; background-color: #0a0a0a;">
                            <p style="color: #4db8ff; font-size: 14px; margin: 0;">
                                © 2024 App Ejecutiva. Todos los derechos reservados.
                            </p>
                            <p style="color: #888888; font-size: 12px; margin-top: 10px;">
                                Este es un correo electrónico automático, por favor no responda a este mensaje.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
      `;
  }

  async run(template: TemplateType, to: string, inputs: ErrorMessageEmailDto, asunto: string = 'Error de carga de datos') {
    /*
      <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa;">
        <img src="[URL_DE_TU_LOGO]" alt="App Ejecutiva Logo" style="max-height: 60px;">
      </div>
    */

    const selectedTemplates: { [key in TemplateType]: () => string } = {
      ERROR: () => this.getTemplateError(inputs),
    };

    const htmlContent = selectedTemplates[template]();

    const options: EmailOptions = {
      from: `"Servicio de App Ejecutiva" <${envs.messenger.email.from}>`,
      to: to,
      subject: asunto,
      html: htmlContent,
    };

    await this.emailProvider.send(options);
  }

  async send(code: string, message: string, location: string) {
    try {
      await this.run('ERROR', envs.messenger.email.support, {
        receptor: envs.messenger.email.receptor,
        errorCode: code,
        errorLocation: location,
        errorMessage: message,
        timestamp: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
      });
    } catch (error) {}
  }
}
