import { CredentialDto, LoginDto } from '../../dtos';

export interface ILoginServicePort {
  login(credential: CredentialDto): Promise<LoginDto>;
}
