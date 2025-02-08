import { IMapper } from 'src/app/modules/mappers/domain/models';
import { ConnectionEntity } from '../entities';
import { ConnectionDto } from '../dtos';

export class ConnectionEntityToConnectionDtoMapper implements IMapper<ConnectionEntity, ConnectionDto> {
  async mapping(input: ConnectionEntity): Promise<ConnectionDto> {
    return ConnectionEntityToConnectionDtoMapper.map(input);
  }

  static async map(input: ConnectionEntity): Promise<ConnectionDto> {
    return new ConnectionEntity({
      id: input.id,
      name: input.name,
      connection: input.connection,
      description: input.description,
    });
  }

  static async maps(inputs: ConnectionEntity[]): Promise<ConnectionDto[]> {
    return Promise.all(inputs.map((item) => ConnectionEntityToConnectionDtoMapper.map(item)));
  }
}
