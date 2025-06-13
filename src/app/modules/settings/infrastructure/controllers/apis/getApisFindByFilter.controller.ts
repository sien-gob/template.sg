import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { ApiDto } from '../../../domain/dtos';
import { GetApisByFilterService } from '../../../application/services';
import { ApiFilterDto } from '../../../domain/dtos/apis/apiFilter.dto';

@Controller('apis')
export class GetApisByFilterController {
  constructor(private readonly getApisService: GetApisByFilterService) {}

  @Post('find')
  @ProcessRequest<ApiDto[]>()
  async getReport(@Body() filter: ApiFilterDto): Promise<ApiDto[]> {
    return await this.getApisService.run(filter.filter);
  }
}
