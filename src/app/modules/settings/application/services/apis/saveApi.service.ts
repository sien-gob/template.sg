import { Inject, Injectable } from '@nestjs/common';
import { ISaveApiRepository } from '../../../domain/ports/repositories';
import { CreateApiDto } from '../../../domain/dtos/Apis/createApi.dto';
import { CreateApiDtoToCreateApiEntityMapper } from '../../../domain/mappers';

@Injectable()
export class SaveApiService {
  constructor(
    @Inject('ISaveApiRepository')
    private readonly saveApi: ISaveApiRepository,
  ) {}

  async run(input: CreateApiDto) {
    const data = await CreateApiDtoToCreateApiEntityMapper.map(input);
    await this.saveApi.save(data);
    return {
      message: 'Se guardo la api correctamente',
    };
  }
}
