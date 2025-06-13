export interface IApplyContextApiRepository {
  apply(contextId: string, apiId: string): Promise<void>;
}
