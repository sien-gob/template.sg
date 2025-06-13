import { ClientScope } from "src/app/modules/shared/models";

export class CredentialEntity {
  constructor(data?: Partial<CredentialEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  username: string;
  password: string;
}
