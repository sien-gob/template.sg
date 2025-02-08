import { Inject, Injectable } from '@nestjs/common';
import { ISyslogSaveRepository } from '../../domain/ports';
import { CreateSyslogDtoToCreateSyslogEntityMapper, SyslogEntityToSyslogDtoMapper } from '../../domain/mappers';
import { CreateSyslogDto } from '../../domain/dtos';

@Injectable()
export class SyslogSaveService {
  constructor(
    @Inject('ISyslogSaveRepository')
    private readonly saveService: ISyslogSaveRepository,
  ) {}

  async run(input: CreateSyslogDto) {
    const entity = await CreateSyslogDtoToCreateSyslogEntityMapper.map(input);
    const result = await this.saveService.save(entity);
    const item = await SyslogEntityToSyslogDtoMapper.map(result);
    return item;
  }
}
