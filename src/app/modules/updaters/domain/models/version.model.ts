export interface DatabaseConfig {
  version: {
    codigo: string;
    nombre: string;
    valor: any;
    descripcion: string;
  };
}

export interface ScriptExecution {
  checksum: string;
  name: string;
  result: {
    status: 'success' | 'error';
    message: string;
    error?: string;
    executedAt: string;
  };
}

export interface ProgressData {
  jobId?: string;
  status?: 'updated' | 'already_updated' | 'progress' | 'error' | 'completed' | 'none';
  progress?: number;
  fileName?: string;
  fileFullName?: string;
  fileIndex?: number;
  message?: string;
}

export interface ScriptFile {
  path: string;
  content: string;
  checksum: string;
}
