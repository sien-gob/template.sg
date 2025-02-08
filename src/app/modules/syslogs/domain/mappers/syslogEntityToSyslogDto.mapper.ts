import { IMapper } from 'src/app/modules/mappers/domain/models';
import { SyslogEntity } from '../entities';
import { SyslogDto } from '../dtos';

export class SyslogEntityToSyslogDtoMapper implements IMapper<SyslogEntity, SyslogDto> {
  async mapping(input: SyslogEntity): Promise<SyslogDto> {
    return SyslogEntityToSyslogDtoMapper.map(input);
  }

  static async map(input: SyslogEntity): Promise<SyslogDto> {
    return new SyslogDto({
      ...input,
    });
  }

  static async maps(inputs: SyslogEntity[]): Promise<SyslogDto[]> {
    return Promise.all(inputs.map((item) => SyslogEntityToSyslogDtoMapper.map(item)));
  }
}
