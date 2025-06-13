export interface IVersionExistenceCheckerRepository {
  exists(checksum: string): Promise<boolean>;
}