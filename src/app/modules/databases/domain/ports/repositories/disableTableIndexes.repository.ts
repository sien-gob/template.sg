export interface IDisableTableIndexesRepository {
  disable(tableName: string): Promise<void>;
}
