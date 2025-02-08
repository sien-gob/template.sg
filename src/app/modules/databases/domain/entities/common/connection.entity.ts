export class ConnectionEntity {
  constructor(data?: Partial<ConnectionEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  name: string;
  connection: {
    server: string;
    database: string;
    uid: string;
    pwd: string;
  };
  description: string;
}
