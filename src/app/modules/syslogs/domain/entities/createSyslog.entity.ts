import { LevelSyslogType, SourceSyslogType } from '../types';

export class CreateSyslogEntity<META=any> {
  constructor(data?: Partial<CreateSyslogEntity<META>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  level: LevelSyslogType;
  code: string;
  source: SourceSyslogType;
  metadata: META;
  message: string;
}
