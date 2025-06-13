import { Inject, Injectable } from '@nestjs/common';
import { IApplyContextApiRepository } from '../../../domain/ports/repositories';

@Injectable()
export class ApplyContextApiService {
  constructor(
    @Inject('IApplyContextApiRepository')
    private readonly applyContext: IApplyContextApiRepository,
  ) {}

  async run(contextId: string, apiId: string) {
    await this.applyContext.apply(contextId, apiId);
    return {
      message: 'Se aplico correctamente el contexto a la api',
    };
  }
}
