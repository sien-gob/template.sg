export interface IApplyContextConnectiondbRepository {
  apply(contextId: string, connectionId: string): Promise<void>;
}
