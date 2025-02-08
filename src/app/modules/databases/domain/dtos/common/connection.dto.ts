export class ConnectionDto {
  constructor(data?: Partial<ConnectionDto>) {
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
