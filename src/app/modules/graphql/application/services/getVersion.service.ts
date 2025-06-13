import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Version } from '../../domain/models';
import { format } from 'date-fns';

@Injectable()
export class GetVersionService {
  async run(): Promise<Version> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return {
      type: 'template.sg',
      ver: packageJson.version,
      info: {
        date: currentDate,
        company: 'SIEN-GOB S.A. DE C.V.',
      },
    };
  }
}
