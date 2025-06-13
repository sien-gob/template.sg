export interface ISettingClient {
  id: string;
  email: {
    email: string;
    password: string;
  };
  register: {
    delay: number;
    countLoad: number;
  };
}

export interface ISettingSupport {
  nombre: string;
  origin: string;
  email: string;
}

export interface ISetting {
  id: string;
  data: {
    client: ISettingClient;
    soporte: ISettingSupport;
  };
}

export interface NotifyUpdateInput {
  url: string;
  version: string;
  emails?: string;
}
