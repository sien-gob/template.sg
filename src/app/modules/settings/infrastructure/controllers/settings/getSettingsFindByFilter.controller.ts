import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { SettingDto, SettingFilterDto } from '../../../domain/dtos';
import { GetSettingsByFilterService } from '../../../application/services';


@Controller('settings')
export class GetSettingsByFilterController {
  constructor(private readonly getSettingService: GetSettingsByFilterService) {}

  @Post('find')
  @ProcessRequest<SettingDto[]>()
  async getReport(@Body() filter: SettingFilterDto): Promise<SettingDto[]> {
    return await this.getSettingService.run(filter.filter);
  }
}
