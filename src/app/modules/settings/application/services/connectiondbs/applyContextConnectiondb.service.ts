import { Inject, Injectable } from '@nestjs/common';
import { IApplyContextConnectiondbRepository } from '../../../domain/ports/repositories';

@Injectable()
export class ApplyContextConnectiondbService {
  constructor(
    @Inject('IApplyContextConnectiondbRepository')
    private readonly applyContext: IApplyContextConnectiondbRepository,
  ) {}

  async run(contextId: string, connectionId: string) {
    await this.applyContext.apply(contextId, connectionId);
    return {
      message: 'Se aplico correctamente el contexto a la conexión',
    };
  }
}
