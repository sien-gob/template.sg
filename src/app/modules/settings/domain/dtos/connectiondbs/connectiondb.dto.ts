export class ConnectiondbDto<META = any> {
  constructor(data?: Partial<ConnectiondbDto<META>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  metadata?: META;

  id: string;
  type: string;
  name: string;
  server: string;
  database: string;
  username: string;
  password: string;
  description?: string;
}
