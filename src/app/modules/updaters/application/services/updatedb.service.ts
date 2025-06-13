import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { JobData } from '../../infrastructure/processors';

@Injectable()
export class UpdateDbService {
  constructor(@InjectQueue('updatedb') private readonly updateDbQueue: Queue<JobData>) {}

  async run(userId: string, fileBuffer: Buffer) {
    const job = await this.updateDbQueue.add('process-sql-zip', {
      userId: userId,
      file: fileBuffer,
      progressData: {
        status: "none"
      }
    });
    return { jobId: job.id };
  }
}
