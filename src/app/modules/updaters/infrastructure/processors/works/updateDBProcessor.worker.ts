import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { basename } from 'path';
import { FileUtil } from '../../utils';
import {
  ICreateFileVersionRepository,
  IExecuteScriptRepository,
  ISaveCurrentVersionRepository,
  IVersionExistenceCheckerRepository,
} from '../../../domain/ports/repositories';
import { UpdateDbGateway } from '../../gateways';
import { ProgressData } from '../../../domain/models';

export type JobData = {
  userId: string;
  file: Buffer;
  version?: string;
  progressData?: ProgressData;
  executedCount?: number;
  totalFiles?: number;
  summary?: string;
};

@Processor('updatedb')
@Injectable()
export class UpdateDBProcessorWorker extends WorkerHost {
  private readonly logger = new Logger(UpdateDBProcessorWorker.name);

  constructor(
    private readonly fileUtil: FileUtil,

    private readonly wsGateway: UpdateDbGateway,

    @Inject('IVersionExistenceCheckerRepository')
    private readonly vsCheker: IVersionExistenceCheckerRepository,

    @Inject('ISaveCurrentVersionDbRepository')
    private readonly saveVersionDb: ISaveCurrentVersionRepository,

    @Inject('ISaveCurrentVersionAppRepository')
    private readonly saveVersionApp: ISaveCurrentVersionRepository,

    @Inject('ICreateFileVersionRepository')
    private readonly createFileVersion: ICreateFileVersionRepository,

    @Inject('IExecuteScriptRepository')
    private readonly exeScript: IExecuteScriptRepository,
  ) {
    super();
  }

  async process(job: Job<JobData>): Promise<any> {
    let cleanup: (() => Promise<void>) | null = null;
    const fileBuffer = Buffer.isBuffer(job.data.file) ? job.data.file : Buffer.from(job.data.file);

    try {
      const zipResult = await this.fileUtil.processZipFile(fileBuffer);
      const { config, sqlFiles } = zipResult;
      cleanup = zipResult.cleanup;

      job.data.version = config.version.codigo;
      job.data.executedCount = 0;
      job.data.totalFiles = sqlFiles.length;

      // Procesar archivos uno por uno
      for (let i = 0; i < sqlFiles.length; i++) {
        const filePath = sqlFiles[i];
        const scriptName = basename(filePath);
        const progress = Math.round(((i + 1) / job.data.totalFiles) * 100);

        job.data.progressData = {
          status: 'progress',
          jobId: job.id,
          progress: progress,
          fileIndex: i,
          fileFullName: filePath,
          fileName: scriptName,
        };

        try {
          const wasExecuted = await this.processScript(filePath, job);
          if (wasExecuted) job.data.executedCount++;
        } catch (error) {
          this.logger.error(`Error en ${scriptName}: ${error.message}`);
          job.data.progressData.message = error.message;
          throw error; // Detener en el primer error
        }
      }

      await this.saveVersionDb.save(config);
      await this.saveVersionApp.save(config);
      job.data.summary = `Completado: ${job.data.executedCount} ejecutados, ${job.data.totalFiles - job.data.executedCount} omitidos`;

      return {
        success: true,
        executedScripts: job.data.executedCount,
        skippedScripts: job.data.totalFiles - job.data.executedCount,
        version: config.version,
      };
    } catch (error) {
      throw error;
    } finally {
      await Promise.allSettled([cleanup?.().catch((err) => this.logger.warn(`Error limpiando: ${err.message}`))]);
    }
  }

  private async processScript(filePath: string, job: Job<JobData>): Promise<boolean> {
    const content = await this.fileUtil.readSqlFile(filePath);

    const checksumMatch = content.match(/--\s*checksum\s*:\s*["']([^"']+)["']\s*;?\s*/i);
    if (!checksumMatch?.[1]?.trim()) {
      throw new Error(`Checksum no encontrado en ${job.data.progressData?.fileName}. Formato esperado: -- checksum: "valor"`);
    }

    const checksum = checksumMatch[1].trim();
    const checksumExists = await this.vsCheker.exists(checksum);

    if (checksumExists) {
      job.data.progressData!.status = 'already_updated';
      job.data.progressData!.message = 'Ya ejecutado';
      await job.updateProgress(0);
      return false;
    }

    const result = await this.exeScript.execute(content);

    if (result.status === 'error') {
      throw new Error(result.message || 'Error ejecutando script');
    }

    const relativePath = filePath.split('/').pop() || job.data.progressData?.fileName!;
    await this.createFileVersion.create({ checksum, name: job.data.progressData?.fileName!, result: result, description: '' });

    // Notificar éxito
    job.data.progressData!.message = result.message;
    await job.updateProgress(job.data.progressData?.progress!);

    return true;
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job<JobData>) {
    this.wsGateway.notifyProgress(job.data.userId, job.data.progressData!);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<JobData>) {
    job.data.progressData!.status = 'completed';
    job.data.progressData!.message = job.data.summary || 'Base de dato actualizada correctamente';
    this.wsGateway.notifyCompleted(job.data.userId, job.data.progressData!);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<JobData>) {
    job.data.progressData!.status = 'error';
    job.data.progressData!.message = job.failedReason;
    this.wsGateway.notifyFailed(job.data.userId, job.data.progressData!);
  }
}
