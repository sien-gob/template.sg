export class CreateSettingDto<T = any> {
  constructor(data?: Partial<CreateSettingDto<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  data: T;
}
