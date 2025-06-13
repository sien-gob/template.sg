import { DatabaseConfig } from "../../models";

export interface ISaveCurrentVersionRepository {
  save(config: DatabaseConfig): Promise<void>;
}