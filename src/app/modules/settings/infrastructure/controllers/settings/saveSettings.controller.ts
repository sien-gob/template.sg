import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { SaveSettingService } from '../../../application/services';
import { CreateSettingDto } from '../../../domain/dtos';

@Controller('settings')
export class SaveSettingController {
  constructor(private readonly saveSettingService: SaveSettingService) {}

  @Post('save')
  @ProcessRequest<{ message: string }>()
  async save(@Body() input: CreateSettingDto): Promise<{ message: string }> {
    return await this.saveSettingService.run(input);
  }
}
