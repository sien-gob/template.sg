import { Module } from '@nestjs/common';
import { NotifyByEmailService, NotifyRegByEmailService } from './application/services';
import { EmailNodemailerProvider } from './infrastructure/adapters/providers';

@Module({
  providers: [
    {
      provide: 'IEmailProvider',
      useClass: EmailNodemailerProvider,
    },
    NotifyRegByEmailService,
    NotifyByEmailService,
  ],
  exports: [NotifyRegByEmailService, NotifyByEmailService],
})
export class MessengerModule {}
