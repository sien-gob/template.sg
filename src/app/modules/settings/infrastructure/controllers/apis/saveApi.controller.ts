import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { SaveApiService } from '../../../application/services';
import { CreateApiDto } from '../../../domain/dtos';

@Controller('apis')
export class SaveApiController {
  constructor(private readonly saveApisService: SaveApiService) {}

  @Post('save')
  @ProcessRequest<{ message: string }>()
  async save(@Body() input: CreateApiDto): Promise<{ message: string }> {
    return await this.saveApisService.run(input);
  }
}
