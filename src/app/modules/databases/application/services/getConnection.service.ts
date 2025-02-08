import { Inject, Injectable } from '@nestjs/common';
import { IGetConnections } from '../../domain/ports';
import { ConnectionDto } from '../../domain/dtos';
import { ConnectionEntityToConnectionDtoMapper } from '../../domain/mappers';

@Injectable()
export class GetConnectionService {
  constructor(
    @Inject('IGetConnections')
    private readonly getConnection: IGetConnections,
  ) {}

  async run(name: string): Promise<ConnectionDto> {
    const connection = await this.getConnection.getConnection(name);
    return ConnectionEntityToConnectionDtoMapper.map(connection);
  }
}
