import { LevelSyslogType, SourceSyslogType } from '../types';

export class CreateSyslogDto<META = any> {
  constructor(data?: Partial<CreateSyslogDto<META>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  level: LevelSyslogType;
  source: SourceSyslogType;
  metadata: META;
  message: string;
}
