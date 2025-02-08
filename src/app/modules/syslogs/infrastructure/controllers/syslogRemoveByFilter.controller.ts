import { Controller, Post, Body } from '@nestjs/common';
import { SyslogFilterDto } from '../../domain/dtos';
import { SyslogRemoveByFilterService } from '../../application/services';
import { ProcessRequest } from 'src/system/response/decorators';

@Controller('syslog')
export class SyslogRemoveByFilterController {
  constructor(private readonly syslogService: SyslogRemoveByFilterService) {}

  @Post('clear')
  @ProcessRequest<string>()
  async remove(@Body() filter: SyslogFilterDto): Promise<string> {
    await this.syslogService.run(filter.filter);

    return "Se limpio log correctamente"
  }
}
