import { Controller, Get } from "@nestjs/common"
import { ProcessRequest } from "src/system/response/decorators";
import { GetCurrentVersionService, ResponseVersions } from '../../application/services';

@Controller('versions')
export class GetVersionController {
  constructor(private readonly getVersion: GetCurrentVersionService) {}

  @Get()
  @ProcessRequest<ResponseVersions>()
  async getVersions(): Promise<ResponseVersions> {
    return await this.getVersion.run()
  }
}
