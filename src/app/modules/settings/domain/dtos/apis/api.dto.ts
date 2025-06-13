import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class ApiDto<META = any> {
  constructor(data?: Partial<ApiDto<META>>) {
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
