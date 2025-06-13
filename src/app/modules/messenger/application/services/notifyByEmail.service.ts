import { Inject, Injectable } from '@nestjs/common';
import { IEmailProvider } from '../../domain/ports/providers';
import { EmailOptions } from '../../domain/models';
import { envs } from 'src/system/configs';
import { ErrorMessageEmailDto, SuccessMessageEmailDto, UrlMessageEmailDto } from '../../domain/dtos';
import { format } from 'date-fns';
import { GetSettingsSupport } from 'src/app/modules/settings/infrastructure/supports';
import { DynamicTableEmailDto } from '../../domain/dtos/dynamicTable.dto';

type TemplateType = 'ERROR' | 'SUCCESS' | 'DYNAMIC_TABLE' | 'URL_LINK';

@Injectable()
export class NotifyByEmailService {
  constructor(
    @Inject('IEmailProvider')
    private readonly emailProvider: IEmailProvider,
  ) {}

  private getTemplateError(inputs: ErrorMessageEmailDto) {
    const { errorCode, errorLocation, errorMessage, origin, receptor, timestamp } = inputs;
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
                                Hola,  ${receptor}
                            </h1>

                            <div style="background-color: #2a2a2a; border-left: 4px solid #ff4d4d; padding: 20px; margin-bottom: 30px;">
                                <h2 style="color: #ff4d4d; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                                    Error Detectado <br/>
                                </h2>
                                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                    ${errorMessage}
                                </p>
                                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                    Origen: ${origin}
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

  private getTemplateSuccess(inputs: SuccessMessageEmailDto) {
    const { title, message, details, timestamp, origin, receptor } = inputs;
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notificación de Éxito</title>
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

                  <div style="background-color: #2a2a2a; border-left: 4px solid #4CAF50; padding: 20px; margin-bottom: 30px;">
                      <h2 style="color: #4CAF50; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                          ${title}
                      </h2>
                      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${message}
                      </p>
                      <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          Origen: ${origin}
                      </p>
                  </div>

                  <!-- Detalles de la Operación -->
                  <div style="background-color: #2c2c2c; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                      <h3 style="color: #4db8ff; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
                          Detalles de la Operación:
                      </h3>
                      <p style="color: #b0b0b0; font-size: 14px; line-height: 1.5; margin: 0;">
                          Fecha y Hora: ${timestamp}<br>
                          ${details}
                      </p>
                  </div>

                  <!-- Contacto de Soporte -->
                  <div style="background-color: #2a2a2a; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 30px;">
                      <p style="color: #b0b0b0; margin: 0; font-size: 14px;">
                          Si tiene alguna pregunta, contáctenos a:
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

  private getTemplateDynamicTable(inputs: DynamicTableEmailDto) {
    const { title, message, origin, receptor, tableData, tableHeaders } = inputs;
    const timestamp = format(Date.now(), 'yyyy-MM-dd HH:mm:ss'); // Generado automáticamente aquí

    // Generamos las filas de la tabla basadas en los headers proporcionados
    let tableRows = '';

    tableData.forEach((row, index) => {
      const isEvenRow = index % 2 === 0;
      const rowBgColor = isEvenRow ? '#222222' : '#2a2a2a';

      tableRows += `<tr style="background-color: ${rowBgColor};">`;

      // Para cada header, extraemos el valor correspondiente del objeto
      tableHeaders.forEach((header) => {
        // Obtenemos el valor, manejando casos donde podría ser undefined
        const value = row[header] !== undefined ? row[header] : '';

        // Si el valor es un objeto o array, lo convertimos a formato JSON para visualización
        const displayValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

        tableRows += `<td style="padding: 10px; border-bottom: 1px solid #333; color: #e0e0e0;">${displayValue}</td>`;
      });

      tableRows += '</tr>';
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #121212;
                color: #e0e0e0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            th {
                background-color: #333;
                color: #fff;
                font-weight: bold;
                text-align: left;
                padding: 10px;
                border-bottom: 2px solid #444;
            }
            .data-table {
                overflow-x: auto;
                max-width: 100%;
            }
        </style>
    </head>
    <body>
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <!-- Contenido Principal -->
            <div style="padding: 40px 20px; background-color: #1e1e1e;">
                <h1 style="color: #4db8ff; margin-bottom: 20px; font-size: 24px;">
                    Hola, ${receptor}
                </h1>

                <div style="background-color: #2a2a2a; border-left: 4px solid #ff4d4d; padding: 20px; margin-bottom: 30px;">
                    <h2 style="color: #ff4d4d; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                        ${title}
                    </h2>
                    <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        ${message}
                    </p>
                    <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        Origen: ${origin}
                    </p>
                </div>

                <!-- Tabla Dinámica -->
                <div style="background-color: #2c2c2c; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #4db8ff; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
                        Detalles:
                    </h3>
                    <div class="data-table">
                        <table>
                            <thead>
                                <tr>
                                    ${tableHeaders.map((header) => `<th>${header}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <p style="color: #b0b0b0; font-size: 14px; margin-top: 15px;">
                        Fecha y Hora: ${timestamp}
                    </p>
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

  private getTemplateUrlLink(inputs: UrlMessageEmailDto) {
    const { title, description, url, buttonText, origin, receptor, additionalInfo } = inputs;
    const timestamp = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');

    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: #e0e0e0;
        }
        .button {
            display: inline-block;
            background-color: #2563eb; /* Azul más oscuro */
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 5px;
            font-weight: bold;
            margin: 15px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .url-display {
            word-break: break-all;
            background-color: #1a1a1a; /* Más oscuro */
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            font-family: monospace;
            border-left: 4px solid #2563eb;
            color: #9ca3af; /* Gris claro para el texto */
        }
    </style>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Contenido Principal -->
        <div style="padding: 40px 20px; background-color: #18181b;">
            <h1 style="color: #60a5fa; margin-bottom: 20px; font-size: 24px;">
                Hola, ${receptor}
            </h1>

            <div style="background-color: #27272a; border-left: 4px solid #2563eb; padding: 20px; margin-bottom: 30px;">
                <h2 style="color: #60a5fa; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                    ${title}
                </h2>
                <p style="color: #d1d5db; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    ${description}
                </p>
                <p style="color: #d1d5db; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Origen: ${origin}
                </p>
                
                <!-- Botón de Acceso -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" class="button" style="color: #ffffff; background-color: #2563eb; display: inline-block; padding: 12px 25px; border-radius: 5px; font-weight: bold; text-decoration: none;">
                        ${buttonText || 'Acceder Ahora'}
                    </a>
                </div>
                
                <!-- URL para copiar -->
                <p style="color: #9ca3af; font-size: 14px; margin-top: 20px; margin-bottom: 5px;">
                    Si el botón no funciona, copia y pega esta URL en tu navegador:
                </p>
                <div class="url-display" style="word-break: break-all; background-color: #1a1a1a; padding: 10px; border-radius: 5px; font-family: monospace; border-left: 4px solid #2563eb; color: #9ca3af;">
                    ${url}
                </div>
            </div>

            ${
              additionalInfo
                ? `
            <!-- Información Adicional -->
            <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #60a5fa; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
                    Información Adicional:
                </h3>
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
                    ${additionalInfo}
                </p>
            </div>
            `
                : ''
            }

            <!-- Detalles de Tiempo -->
            <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
                    Fecha y Hora: ${timestamp}
                </p>
            </div>

            <!-- Contacto de Soporte -->
            <div style="background-color: #27272a; border-left: 4px solid #d97706; padding: 15px; margin-bottom: 30px;">
                <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                    Si necesita ayuda, contáctenos a:
                    <br>soporte@appejecutiva.com
                    <br>Teléfono: +XX XXX XXX XXX
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background-color: #09090b;">
            <p style="color: #60a5fa; font-size: 14px; margin: 0;">
                © 2024 App Ejecutiva. Todos los derechos reservados.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
                Este es un correo electrónico automático, por favor no responda a este mensaje.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private processEmails(emailString: string): string[] {
    return emailString.split(',').map((email) => email.trim());
  }

  async run(
    template: TemplateType,
    inputs: ErrorMessageEmailDto | SuccessMessageEmailDto | DynamicTableEmailDto | UrlMessageEmailDto,
    asunto: string,
    emailsTo?: string | string[],
  ) {
    const selectedTemplates: { [key in TemplateType]: () => string } = {
      ERROR: () => this.getTemplateError(inputs as ErrorMessageEmailDto),
      SUCCESS: () => this.getTemplateSuccess(inputs as SuccessMessageEmailDto),
      DYNAMIC_TABLE: () => this.getTemplateDynamicTable(inputs as DynamicTableEmailDto),
      URL_LINK: () => this.getTemplateUrlLink(inputs as UrlMessageEmailDto),
    };

    const htmlContent = selectedTemplates[template]();

    // Determina los correos destinatarios
    let recipients: string[];

    if (emailsTo) {
      // Si se proporciona un array o string de correos específicos, úsalos
      if (Array.isArray(emailsTo)) {
        recipients = emailsTo;
      } else {
        recipients = this.processEmails(emailsTo);
      }
    } else {
      // De lo contrario, usa los correos de soporte como antes
      const support = await GetSettingsSupport.getSetting();
      recipients = this.processEmails(support.data.soporte.email);
    }

    const options: EmailOptions = {
      from: `"Servicio de App Ejecutiva" <${envs.messenger.email.from}>`,
      to: recipients.join(', '),
      subject: asunto,
      html: htmlContent,
    };

    await this.emailProvider.send(options);
  }

  async sendError(code: string, message: string, location: string) {
    const support = await GetSettingsSupport.getSetting();
    const emailOrigin = support.data.soporte?.origin || '';
    const emailReceptor = support.data.soporte.nombre;

    try {
      await this.run(
        'ERROR',
        {
          origin: emailOrigin,
          receptor: emailReceptor,
          errorCode: code,
          errorLocation: location,
          errorMessage: message,
          timestamp: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
        },
        'Error de carga de datos',
      );
    } catch (error) {}
  }

  async sendSuccess(title: string, message: string, details: string) {
    const support = await GetSettingsSupport.getSetting();
    const emailOrigin = support.data.soporte?.origin || '';
    const emailReceptor = support.data.soporte.nombre;

    try {
      await this.run(
        'SUCCESS',
        {
          origin: emailOrigin,
          receptor: emailReceptor,
          title,
          message,
          details,
          timestamp: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
        },
        'Operación Exitosa',
      );
    } catch (error) {}
  }

  async sendDynamicTable(title: string, message: string, tableData: Record<string, any>[], tableHeaders: string[], asunto?: string) {
    const support = await GetSettingsSupport.getSetting();
    const emailOrigin = support.data.soporte?.origin || '';
    const emailReceptor = support.data.soporte.nombre;

    try {
      await this.run(
        'DYNAMIC_TABLE',
        {
          origin: emailOrigin,
          receptor: emailReceptor,
          title,
          message,
          tableData,
          tableHeaders,
        },
        asunto || 'Datos de Notificación',
      );
    } catch (error) {
      // Manejar error silenciosamente como en los otros métodos
    }
  }

  async sendUrlLink(title: string, description: string, url: string, emails: string[], buttonText?: string, additionalInfo?: string, asunto?: string) {
    const support = await GetSettingsSupport.getSetting();
    const emailOrigin = support.data.soporte?.origin || '';
    const emailReceptor = support.data.soporte.nombre;

    try {
      await this.run(
        'URL_LINK',
        {
          origin: emailOrigin,
          receptor: emailReceptor,
          title,
          description,
          url,
          buttonText: buttonText || 'Acceder',
          additionalInfo,
        },
        asunto || 'Enlace - App Ejecutiva',
        emails,
      );
    } catch (error) {
      // Manejar error silenciosamente como en los otros métodos
    }
  }
}
