import { Inject, Injectable } from '@nestjs/common';
import { IGetContextsByFilterRepository } from '../../../domain/ports/repositories';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class GetContextsByFilterService {
  constructor(
    @Inject('IGetContextsByFilterRepository')
    private readonly getContexts: IGetContextsByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    const result = await this.getContexts.find(filter);
    return result
  }
}
