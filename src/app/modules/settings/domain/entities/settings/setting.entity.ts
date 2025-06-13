export class SettingEntity<T = any> {
  constructor(data?: Partial<SettingEntity<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  data: T;
}
