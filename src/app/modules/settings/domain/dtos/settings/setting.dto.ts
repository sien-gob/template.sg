export class SettingDto<T = any> {
  constructor(data?: Partial<SettingDto<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  data: T;
}
