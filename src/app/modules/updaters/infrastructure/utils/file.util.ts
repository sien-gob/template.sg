import { Injectable, Logger } from '@nestjs/common';
import AdmZip = require('adm-zip');
import * as fs from 'fs-extra';
import * as tmp from 'tmp-promise';
import { join, extname } from 'path';
import { DatabaseConfig } from '../../domain/models';

export interface ProcessZipResult {
  config: DatabaseConfig;
  tempDir: string;
  sqlFiles: string[];
  cleanup: () => Promise<void>;
}

@Injectable()
export class FileUtil {
  async processZipFile(buffer: Buffer): Promise<ProcessZipResult> {
    // Crear directorio temporal
    const { path: tempDir, cleanup: tmpCleanup } = await tmp.dir({ unsafeCleanup: false });
    try {
      

      const zip = new AdmZip(buffer);

      const entries = zip.getEntries();
      const configEntry = entries.find((entry) => entry.entryName.endsWith('config.json'));
      const pathConfig = tempDir + '\\' + configEntry?.entryName.replaceAll(`/${configEntry?.name}`, '') + '\\config.json';

      zip.extractAllTo(tempDir, true);
      
      if (!(await fs.pathExists(pathConfig))) {
        throw new Error('Archivo config.json no encontrado en el ZIP');
      }
      const config: DatabaseConfig = JSON.parse(await fs.readFile(pathConfig, 'utf8'));

      // Encontrar archivos .sql
      const sqlFiles = await this.findSqlFiles(tempDir);

      return {
        config,
        tempDir,
        sqlFiles: sqlFiles.sort(),
        cleanup: async () => {
          try {
            //await tmpCleanup();
          } catch (error) {}
        },
      };
    } catch (error) {
      //await tmpCleanup().catch(() => {});
      console.log("file.util :: ", error.message);
      throw error;
    }
  }

  async readSqlFile(filePath: string): Promise<string> {
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    const content = await fs.readFile(filePath, 'utf8');

    if (!content.trim()) {
      console.log('file.util :: ', `Archivo SQL vacío: ${filePath}`);
    }

    return content;
  }

  private async findSqlFiles(dir: string): Promise<string[]> {
    let sqlFiles: string[] = [];
    const files = await fs.readdir(dir);

    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        const subFiles = await this.findSqlFiles(fullPath);
        sqlFiles.push(...subFiles);
      } else if (extname(file).toLowerCase() === '.sql') {
        sqlFiles.push(fullPath);
      }
    }

    return sqlFiles;
  }
}
