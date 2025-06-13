export interface IUnitOfWorkPort {
  complete<T>(repositories: () => Promise<void>, work: () => Promise<T>): Promise<T>;
  register(repository: any): Promise<void>;
}
