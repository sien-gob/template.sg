import { CreateApiEntity } from '../../../entities/Apis/createApi.entity';

export interface ISaveApiRepository {
  save(input: CreateApiEntity): Promise<void>;
}
