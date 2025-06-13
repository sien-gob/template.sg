import { Injectable } from "@nestjs/common";
import { DisableTableIndexesService } from "./disableTableIndexes.service";
import { EnableTableIndexesService } from "./enableTableIndexes.service";

@Injectable()
export class TableIndexService {
  constructor(
    private readonly disableService: DisableTableIndexesService,
    private readonly enableService: EnableTableIndexesService,
  ) {}

  async disableIndexes(tableName: string) {
    await this.disableService.run(tableName);
  }

  async enableIndexes(tableName: string) {
    await this.enableService.run(tableName);
  }
}
