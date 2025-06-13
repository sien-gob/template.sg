export class DynamicTableEmailDto {
  constructor(data?: Partial<DynamicTableEmailDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  title: string;
  message: string;
  origin: string;
  receptor: string;
  tableData: Record<string, any>[];
  tableHeaders: string[];
}
