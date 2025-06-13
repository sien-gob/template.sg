import { Inject } from '@nestjs/common';
import axios from 'axios';
import { NotifyByEmailService } from 'src/app/modules/messenger/application/services';
import { SyslogSaveService } from 'src/app/modules/syslogs/application/services';


export function HandleErrors(props: { code?: string; config?: { logPersistence?: boolean; notifyErrorEmail?: boolean } } = {}) {
  const { code = '0', config = {} } = props;
  const { logPersistence = false, notifyErrorEmail = false } = config;

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Inyectar servicios solo si están habilitados en la configuración
    if (logPersistence) {
      const injectSyslogService = Inject(SyslogSaveService);
      injectSyslogService(target, 'logService');
    }

    if (notifyErrorEmail) {
      const injectNotifyErrorByEmailService = Inject(NotifyByEmailService);
      injectNotifyErrorByEmailService(target, 'notifyByEmailService');
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        let message = error.message;

        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
            message = 'Verifique su conexión o el estado del servidor SE.SG.';
          }
        }

        // Guardar en el log solo si logPersistence está habilitado
        if (logPersistence && this.logService) {
          const logSaveService: SyslogSaveService = this.logService;
          await logSaveService.run({
            level: 'ERROR',
            source: 'GRAL',
            metadata: JSON.stringify({ code: code || '0', location: this.constructor.name, message }),
            message,
          });
        }

        // Notificar por correo solo si notifyErrorEmail está habilitado
        if (notifyErrorEmail && this.notifyByEmailService) {
          const notifyService: NotifyByEmailService = this.notifyByEmailService;
          await notifyService.sendError(code, message, this.constructor.name);
        }

        throw error;
      }
    };

    return descriptor;
  };
}
