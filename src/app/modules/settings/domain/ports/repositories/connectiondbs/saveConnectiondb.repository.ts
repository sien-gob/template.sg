import { CreateConnectiondbEntity } from '../../../entities/Connectiondbs/createConnectiondb.entity';

export interface ISaveConnectiondbRepository {
  save(input: CreateConnectiondbEntity): Promise<void>;
}
