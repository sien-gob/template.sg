export class CreateApiEntity {
  constructor(data?: Partial<CreateApiEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  type: string;
  name: string;
  url: string;
  description?: string;
}
