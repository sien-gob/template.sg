import { IMapper } from 'src/app/modules/mappers/domain/models';
import { ConnectiondbEntity } from '../../entities';
import { ConnectiondbDto } from '../../dtos';

export class ConnectiondbEntityToConnectiondbDtoMapper implements IMapper<ConnectiondbEntity, ConnectiondbDto> {
  async mapping(input: ConnectiondbEntity): Promise<ConnectiondbDto> {
    return ConnectiondbEntityToConnectiondbDtoMapper.map(input);
  }

  static async map(input: ConnectiondbEntity): Promise<ConnectiondbDto> {
    return new ConnectiondbDto({
      ...input,
    });
  }

  static async maps(inputs: ConnectiondbEntity[]): Promise<ConnectiondbDto[]> {
    return Promise.all(inputs.map((item) => ConnectiondbEntityToConnectiondbDtoMapper.map(item)));
  }
}
