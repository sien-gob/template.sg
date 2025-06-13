import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateCuentaService } from '../../application/services';
import { CuentaDto, UpdateCuentaDto } from '../../domain/dtos';
import { ProcessRequest } from 'src/system/response/decorators';
import { CuentaResponse } from '../../domain/responses';

@Resolver()
export class UpdateCuentaResolver {
  constructor(private readonly updateCuentaService: UpdateCuentaService) {}

  @Mutation(() => CuentaResponse, { name: 'updateCuenta' })
  @ProcessRequest<CuentaDto>()
  async update(@Args('codigo') codigo: string, @Args('inputs') inputs: UpdateCuentaDto): Promise<CuentaDto> {
    return await this.updateCuentaService.run(codigo, inputs);
  }
}
