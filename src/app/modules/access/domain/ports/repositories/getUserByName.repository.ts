import { CredentialEntity, UserEntity } from '../../entities';

export interface IGetUserByNameRepository {
  getUserByName(credential: CredentialEntity): Promise<UserEntity | undefined>;
}
