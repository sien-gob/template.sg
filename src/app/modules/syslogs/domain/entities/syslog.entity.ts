import { LevelSyslogType, SourceSyslogType } from '../types';

export class SyslogEntity<META_DATA = any> {
  constructor(data?: Partial<SyslogEntity<META_DATA>>) {
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
