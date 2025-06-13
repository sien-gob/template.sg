import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { ConnectiondbDto } from '../../../domain/dtos';
import { GetConnectiondbsByFilterService } from '../../../application/services';
import { ConnectiondbFilterDto } from '../../../domain/dtos/connectiondbs/connectiondbFilter.dto';

@Controller('connectiondbs')
export class GetConnectiondbsByFilterController {
  constructor(private readonly getConnectiondbsService: GetConnectiondbsByFilterService) {}

  @Post("find")
  @ProcessRequest<ConnectiondbDto[]>()
  async getReport(@Body() filter: ConnectiondbFilterDto): Promise<ConnectiondbDto[]> {
    return await this.getConnectiondbsService.run(filter.filter);
  }
}
