import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { RemoveApisByFilterService } from '../../../application/services';
import { ApiFilterDto } from '../../../domain/dtos/apis/apiFilter.dto';

@Controller('apis')
export class RemoveApisByFilterController {
  constructor(private readonly removeApisService: RemoveApisByFilterService) {}

  @Post('remove')
  @ProcessRequest<{ message: string }>()
  async getReport(@Body() filter: ApiFilterDto): Promise<{ message: string }> {
    return await this.removeApisService.run(filter.filter);
  }
}
