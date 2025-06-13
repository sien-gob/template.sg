import { Controller, Post, Body } from '@nestjs/common';
import { ProcessRequest } from 'src/system/response/decorators';
import { SaveConnectiondbService } from '../../../application/services';
import { CreateConnectiondbDto } from '../../../domain/dtos';

@Controller('connectiondbs')
export class SaveConnectiondbController {
  constructor(private readonly saveConnectiondbsService: SaveConnectiondbService) {}

  @Post('save')
  @ProcessRequest<{ message: string }>()
  async save(@Body() input: CreateConnectiondbDto): Promise<{ message: string }> {
    return await this.saveConnectiondbsService.run(input);
  }
}
