import { CreateSyslogEntity, SyslogEntity } from '../../entities';

export interface ISyslogSaveRepository {
  save<I=any, R=any>(input: CreateSyslogEntity<I>): Promise<SyslogEntity<R>>;
}
