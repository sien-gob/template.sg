export class CreateConnectiondbEntity {
  constructor(data?: Partial<CreateConnectiondbEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  type: string;
  name: string;
  server: string;
  database: string;
  username: string;
  password: string;
  description?: string;
}
