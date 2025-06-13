import { LevelSyslogType, SourceSyslogType } from '../types';

export class CreateSyslogDto<META = any> {
  constructor(data?: Partial<CreateSyslogDto<META>>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  
  metadata?: META;
  code?: string;
  level: LevelSyslogType;
  source: SourceSyslogType;
  message: string;
}
