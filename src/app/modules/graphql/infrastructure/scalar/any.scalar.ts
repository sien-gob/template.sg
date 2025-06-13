import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('AnyScalar')
export class AnyScalar {
  description = 'Any scalar value';

  parseValue(value: any) {
    return value;
  }

  serialize(value: any) {
    return value;
  }

  parseLiteral(ast: any) {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.INT:
        return parseInt(ast.value, 10);
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.BOOLEAN:
        return ast.value;
      default:
        return null;
    }
  }
}
