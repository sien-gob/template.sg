import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { ApiDto, ContextFilterDto } from '../../../domain/dtos';
import { GetContextsByFilterService } from '../../../application/services';
import { ContextModel } from '../../../domain/models';

@Controller('contexts')
export class GetContextsByFilterController {
  constructor(private readonly getService: GetContextsByFilterService) {}

  @Post('find')
  @ProcessRequest<ApiDto[]>()
  async getContext(@Body() filter: ContextFilterDto): Promise<ContextModel[]> {
    return await this.getService.run(filter.filter);
  }
}
