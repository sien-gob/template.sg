import { EmailOptions } from '../../models';

export interface IEmailProvider {
  send(emailOptions: EmailOptions): Promise<void>;
}
