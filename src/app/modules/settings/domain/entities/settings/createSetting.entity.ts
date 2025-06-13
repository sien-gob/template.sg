

export class CreateSettingEntity<T = any> {
  constructor(data?: Partial<CreateSettingEntity<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  data: T;
}


