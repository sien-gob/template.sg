import { IMapper } from 'src/app/modules/mappers/domain/models';
import { CreateSyslogEntity, SyslogEntity } from '../entities';
import { CreateSyslogDto } from '../dtos';

export class CreateSyslogDtoToCreateSyslogEntityMapper implements IMapper<CreateSyslogDto, CreateSyslogEntity> {
  async mapping(input: CreateSyslogDto): Promise<CreateSyslogEntity> {
    return CreateSyslogDtoToCreateSyslogEntityMapper.map(input);
  }

  static async map(input: CreateSyslogDto): Promise<CreateSyslogEntity> {
    return new SyslogEntity({
      ...input,
    });
  }

  static async maps(inputs: CreateSyslogDto[]): Promise<CreateSyslogEntity[]> {
    return Promise.all(inputs.map((item) => CreateSyslogDtoToCreateSyslogEntityMapper.map(item)));
  }
}
