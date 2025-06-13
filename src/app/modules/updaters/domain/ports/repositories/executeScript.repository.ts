export type ResultScript = { status: 'success' | 'error'; message: string };

export interface IExecuteScriptRepository {
  execute(scriptContent: string): Promise<ResultScript>;
}
