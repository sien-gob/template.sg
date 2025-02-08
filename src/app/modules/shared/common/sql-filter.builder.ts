// sql-filter.builder.ts

export type Operator = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'BETWEEN' | 'LIKE' | 'IN';
export type FilterValue = string | number | { operator: Operator; value: any };

export interface FilterCondition {
  [key: string]: FilterValue | FilterCondition | Array<FilterCondition>;
}

export interface SqlResult {
  whereClause: string;
  params: any[];
}

export class SqlFilterBuilder {
  private static processOperator(key: string, condition: any, params: any[]): string {
    // Si es un objeto con operador específico
    if (typeof condition === 'object' && 'operator' in condition) {
      const { operator, value } = condition;

      switch (operator) {
        case 'BETWEEN':
          if (Array.isArray(value) && value.length === 2) {
            params.push(value[0], value[1]);
            return `${key} BETWEEN ? AND ?`;
          }
          throw new Error('BETWEEN operator requires an array with two values');

        case 'LIKE':
          //params.push(value);
          //return `${key} LIKE ?`;
          // Convertir el valor a minúsculas para insensibilidad a mayúsculas y minúsculas
          params.push(value.toLowerCase());
          return `LOWER(${key}) LIKE ?`;

        case 'IN':
          if (Array.isArray(value)) {
            // Convertir valores a minúsculas
            const lowerValues = value.map((v) => v.toLowerCase());
            lowerValues.forEach((v) => params.push(v));
            const placeholders = lowerValues.map(() => '?').join(', ');
            return `LOWER(${key}) IN (${placeholders})`;
          }
          throw new Error('IN operator requires an array of values');

        default:
          params.push(value);
          return `${key} ${operator} ?`;
      }
    }

    // Valor directo, usar operador por defecto '='
    // Convertir el valor a minúsculas para insensibilidad a mayúsculas y minúsculas
    if (typeof condition === 'string') {
      params.push(condition.toLowerCase());
      return `LOWER(${key}) = ?`;
    }

    params.push(condition);
    return `${key} = ?`;
  }

  private static processCondition(condition: any, params: any[]): string {
    if (condition === null || condition === undefined) {
      return '';
    }

    if (typeof condition === 'object' && Object.keys(condition).length === 0) {
      return '';
    }

    // Para manejar AND
    if ('AND' in condition) {
      const andConditions = Array.isArray(condition.AND) ? condition.AND : [condition.AND];

      const processedAnds = andConditions
        .map((cond) => {
          if (typeof cond === 'object') {
            if ('OR' in cond || 'AND' in cond) {
              return this.processCondition(cond, params);
            }
            return Object.entries(cond)
              .map(([key, value]) => this.processOperator(key, value, params))
              .join(' AND ');
          }
          return '';
        })
        .filter((cond) => cond !== '');

      return processedAnds.length > 0 ? `(${processedAnds.join(' AND ')})` : '';
    }

    // Para manejar OR
    if ('OR' in condition) {
      const orConditions = Array.isArray(condition.OR) ? condition.OR : [condition.OR];

      const processedOrs = orConditions
        .map((cond) => {
          if (typeof cond === 'object') {
            if ('OR' in cond || 'AND' in cond) {
              return this.processCondition(cond, params);
            }
            return Object.entries(cond)
              .map(([key, value]) => this.processOperator(key, value, params))
              .join(' AND ');
          }
          return '';
        })
        .filter((cond) => cond !== '');

      return processedOrs.length > 0 ? `(${processedOrs.join(' OR ')})` : '';
    }

    // Para condiciones simples key-value
    return Object.entries(condition)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null && !('operator' in value)) {
          return this.processCondition(value, params);
        }
        return this.processOperator(key, value, params);
      })
      .filter((cond) => cond !== '')
      .join(' AND ');
  }

  static build(filter: FilterCondition | null | undefined): SqlResult {
    const params: any[] = [];

    if (!filter || Object.keys(filter).length === 0) {
      return {
        whereClause: '',
        params: [],
      };
    }

    const whereClause = this.processCondition(filter, params);

    return {
      whereClause: whereClause ? `WHERE ${whereClause}` : '',
      params,
    };
  }
}

/*
*
Ejemplo de uso
// Filtro simple
const filter1 = { status: 'active' };
const result1 = SqlFilterBuilder.build(filter1);
// whereClause: "WHERE status = ?"
// params: ['active']

// Filtro con operadores
const filter2 = {
  created_at: { operator: 'BETWEEN', value: ['2024-01-01', '2024-01-31'] },
  status: { operator: '<>', value: 'deleted' }
};
const result2 = SqlFilterBuilder.build(filter2);
// whereClause: "WHERE created_at BETWEEN ? AND ? AND status <> ?"
// params: ['2024-01-01', '2024-01-31', 'deleted']

// Filtro complejo
const filter3 = {
  AND: [
    { status: 'active' },
    {
      OR: [
        { role: 'admin' },
        { permission_level: { operator: '>=', value: 5 } }
      ]
    }
  ]
};
const result3 = SqlFilterBuilder.build(filter3);
// whereClause: "WHERE (status = ? AND (role = ? OR permission_level >= ?))"
// params: ['active', 'admin', 5]



{
  "filter": {
    "OR": [
      {
        "AND": [
          { "level": 1 }
        ]
      },
      {
        "AND": [
          { "level": "ERROR" },
          { "message": { "operator": "LIKE", "value": "%Proceso%"} }
        ]
      }
    ]
  }
}


const filter1 = {
  status: { operator: 'IN', value: ['active', 'pending'] },
};
const result1 = SqlFilterBuilder.build(filter1);
// whereClause: "WHERE status IN (?, ?)"
// params: ['active', 'pending']

const filter2 = {
  AND: [
    { status: { operator: 'IN', value: ['active', 'pending'] } },
    { role: 'admin' },
  ],
};
const result2 = SqlFilterBuilder.build(filter2);
// whereClause: "WHERE (status IN (?, ?) AND role = ?)"
// params: ['active', 'pending', 'admin']


{
  "filter": {
    "level": "ERROR",
    "source": {
      "operator": "IN", "value": ["API_RESPONSE"] 
    }
  }
}

*/
