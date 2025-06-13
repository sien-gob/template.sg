import { Database } from 'src/system/databases';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { SettingEntity } from '../../domain/entities';
import { ISetting } from '../../domain/models';

export class GetSettingsSupport {
  static async getSettings<T = any>(filter: FilterCondition | null | undefined): Promise<SettingEntity<T>[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `SELECT * FROM settings ${whereClause}`;

    const rs = await Database.staticQuery(query, params);
    const items = rs.map((row) => {
      const data = JSON.parse(row.data) as T;

      return new SettingEntity({
        id: row.id,
        data: data,
      });
    });

    return items;
  }

  static async getSetting(): Promise<ISetting> {
    const filter = {
      filter: {
        id: 'setting',
      },
    };

    const supports = await this.getSettings(filter);
    const support = supports[0] as any;
    return support;
  }
}
