export class ConnectiondbEntity<META = any> {
  constructor(data?: Partial<ConnectiondbEntity<META>>) {
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
