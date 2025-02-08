import { Module } from '@nestjs/common';
import { NotifyErrorByEmailService, NotifyRegByEmailService } from './application/services';
import { EmailNodemailerProvider } from './infrastructure/adapters/providers';

@Module({
  providers: [
    {
      provide: 'IEmailProvider',
      useClass: EmailNodemailerProvider,
    },
    NotifyRegByEmailService,
    NotifyErrorByEmailService,
  ],
  exports: [NotifyRegByEmailService, NotifyErrorByEmailService],
})
export class MessengerModule {}
