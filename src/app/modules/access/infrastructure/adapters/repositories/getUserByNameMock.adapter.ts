import { IGetUserByNameRepository } from 'src/app/modules/access/domain/ports/repositories';
import { CredentialEntity, UserEntity } from '../../../domain/entities';
import { Injectable } from '@nestjs/common';
import { mockUsers } from './data.mocks';

@Injectable()
export class GetUserByNameMockAdapter implements IGetUserByNameRepository {
  constructor() {}

  async getUserByName(credential: CredentialEntity): Promise<UserEntity | undefined> {
    const { username, password } = credential;

    const user = mockUsers.find((u) => u.name.trim().toLowerCase() === username.trim().toLowerCase());

    return user;
  }
}
