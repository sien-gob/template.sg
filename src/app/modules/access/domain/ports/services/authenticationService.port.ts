import { JwtPayloadAccess } from "../../payloads";


export interface IAuthenticationServicePort {
  autentication(token: string): Promise<JwtPayloadAccess>;
}
