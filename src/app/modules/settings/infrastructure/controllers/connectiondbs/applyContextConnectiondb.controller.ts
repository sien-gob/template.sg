import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { ApplyContextConnectiondbService } from '../../../application/services';

@Controller('connectiondbs')
export class ApplyContextConnectiondbController {
  constructor(private readonly applyService: ApplyContextConnectiondbService) {}

  @Post('apply-context')
  @ProcessRequest<{ message: string }>()
  async save(@Body() input: { contextId: string; connectiondbId: string }): Promise<{ message: string }> {
    return await this.applyService.run(input.contextId, input.connectiondbId);
  }
}
