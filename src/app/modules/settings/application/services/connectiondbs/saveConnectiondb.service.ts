import { Inject, Injectable } from '@nestjs/common';
import { ISaveConnectiondbRepository } from '../../../domain/ports/repositories';
import { CreateConnectiondbDto } from '../../../domain/dtos/Connectiondbs/createConnectiondb.dto';
import { CreateConnectiondbDtoToCreateConnectiondbEntityMapper } from '../../../domain/mappers';

@Injectable()
export class SaveConnectiondbService {
  constructor(
    @Inject('ISaveConnectiondbRepository')
    private readonly saveConnectiondb: ISaveConnectiondbRepository,
  ) {}

  async run(input: CreateConnectiondbDto) {
    const data = await CreateConnectiondbDtoToCreateConnectiondbEntityMapper.map(input);
    await this.saveConnectiondb.save(data);
    return {
      message: 'Se guardo la conexión correctamente',
    };
  }
}
