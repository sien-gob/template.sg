import { Inject, Injectable } from '@nestjs/common';
import { ISyslogSaveRepository } from '../../domain/ports';
import { CreateSyslogDtoToCreateSyslogEntityMapper, SyslogEntityToSyslogDtoMapper } from '../../domain/mappers';
import { CreateSyslogDto } from '../../domain/dtos';
import { RequestContextService } from 'src/app/modules/requests/services';

@Injectable()
export class SyslogSaveService {
  constructor(
    @Inject('ISyslogSaveRepository')
    private readonly saveService: ISyslogSaveRepository,

    private readonly requestContext: RequestContextService,
  ) {}

  async run(input: CreateSyslogDto) {
    input.code = input.code || this.requestContext.getRequestId() || '';
    const entity = await CreateSyslogDtoToCreateSyslogEntityMapper.map(input);
    const result = await this.saveService.save(entity);
    const item = await SyslogEntityToSyslogDtoMapper.map(result);
    return item;
  }
}
