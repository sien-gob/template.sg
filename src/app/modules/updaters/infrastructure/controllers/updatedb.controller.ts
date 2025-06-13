import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateDbService } from '../../application/services';
import { RedisCheckInterceptor } from 'src/app/modules/redis/core/infrastructure/interceptors';

@Controller('update')
export class UpdateDbController {
  constructor(private readonly update: UpdateDbService) {}

  @Post('db/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSqlZip(@UploadedFile() file: Express.Multer.File, @Body() body: { userId: string }) {
    if (!file) throw new BadRequestException('No se proporcionó archivo');
    if (!file.originalname.endsWith('.zip')) throw new BadRequestException('El archivo debe ser un ZIP');

    const resp = await this.update.run(body.userId, file.buffer);
    return {
      success: true,
      jobId: resp.jobId,
      message: 'Proceso de actualización iniciado',
      websocketUrl: 'ws://localhost:3001/ws/updateDb/notification',
    };
  }
}
