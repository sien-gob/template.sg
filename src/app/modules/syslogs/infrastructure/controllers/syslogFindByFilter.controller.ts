import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { SyslogFilterDto } from '../../domain/dtos';
import { SyslogEntity } from '../../domain/entities';
import { SyslogFindByFilterService } from '../../application/services';
import { ProcessRequest } from 'src/system/response/decorators';
import { Response } from 'express'; // Importar Response de Express
import { join } from 'path';

@Controller('syslog')
export class SyslogFindByFilterController {
  constructor(private readonly syslogService: SyslogFindByFilterService) {}

  @Post('report')
  @ProcessRequest<SyslogEntity[]>()
  async getReport(@Body() filter: SyslogFilterDto): Promise<SyslogEntity[]> {
    return await this.syslogService.run(filter.filter);
  }

  @Get('view') // Nueva ruta para servir la página HTML
  async getLogsView(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', '..', '..', '..', 'public', 'syslog.html'));
  }
}
