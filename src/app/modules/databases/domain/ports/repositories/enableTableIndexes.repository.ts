export interface IEnableTableIndexesRepository {
  enable(tableName: string): Promise<void>;
}
