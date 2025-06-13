import { LevelSyslogType, SourceSyslogType } from '../types';

export class SyslogDto<META_DATA = any> {
  constructor(data?: Partial<SyslogDto<META_DATA>>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: number;
  level: LevelSyslogType;
  code: string;
  source: SourceSyslogType;
  metadata: META_DATA;
  message: string;
  createdAt: string;
}
