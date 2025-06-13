import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { ApplyContextApiService } from '../../../application/services';

@Controller('apis')
export class ApplyContextApiController {
  constructor(private readonly applyService: ApplyContextApiService) {}

  @Post('apply-context')
  @ProcessRequest<{ message: string }>()
  async apply(@Body() input: { contextId: string; apiId: string }): Promise<{ message: string }> {
    return await this.applyService.run(input.contextId, input.apiId);
  }
}
