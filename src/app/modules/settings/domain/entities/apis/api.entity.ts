export class ApiEntity<META=any> {
  constructor(data?: Partial<ApiEntity<META>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  metadata?: META;

  id: string;
  type: string;
  name: string;
  url: string;
  description?: string;
}
