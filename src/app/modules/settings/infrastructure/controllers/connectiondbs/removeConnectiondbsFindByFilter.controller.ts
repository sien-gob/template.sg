import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { RemoveConnectiondbsByFilterService } from '../../../application/services';
import { ConnectiondbFilterDto } from '../../../domain/dtos/connectiondbs/connectiondbFilter.dto';

@Controller('connectiondbs')
export class RemoveConnectiondbsByFilterController {
  constructor(private readonly removeConnectiondbsService: RemoveConnectiondbsByFilterService) {}

  @Post('remove')
  @ProcessRequest<{ message: string }>()
  async remove(@Body() filter: ConnectiondbFilterDto): Promise<{ message: string }> {
    return await this.removeConnectiondbsService.run(filter.filter);
  }
}
