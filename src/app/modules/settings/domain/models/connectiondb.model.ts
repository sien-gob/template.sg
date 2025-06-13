export interface Connectiondb {
  id: string;
  type: string;
  name: string;
  server: string;
  database: string;
  username: string;
  password: string;
  description?: string;
}
