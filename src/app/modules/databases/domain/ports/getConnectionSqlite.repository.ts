import { ConnectionEntity } from '../entities';

export interface IGetConnections {
  getConnection(name: string): Promise<ConnectionEntity>;
}
