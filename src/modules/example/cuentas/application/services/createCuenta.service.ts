import { Inject, Injectable } from '@nestjs/common';
import { CreateCuentaDto, CuentaDto } from '../../domain/dtos';
import { CuentaEntityToCuentaDtoMapper } from '../../domain/mappers';
import { ICreateCuentaRepository } from '../../domain/ports/repositories/createCuenta.repository';
import { CuentaBusinessValidator, CuentaContext } from '../validations';
import { ErrorResult } from 'src/app/modules/businessRules/domain/models';

@Injectable()
export class CreateCuentaService {
  constructor(
    @Inject('ICreateCuentaRepository')
    private readonly cuentaRepository: ICreateCuentaRepository,

    private readonly cuentaValidator: CuentaBusinessValidator,
  ) {}

  async run(data: CreateCuentaDto): Promise<CuentaDto> {
    const context: CuentaContext = {
      codigo: data.codigo,
      nombre: data.nombre,
    };

    //await this.validateBusinessRules_example_1(context);
    //await this.validateBusinessRules_example_2(context);
    //await this.validateBusinessRules_example_3(context);
    //await this.validateBusinessRules_example_4(context);
    //await this.validateBusinessRules_example_5(context);
    await this.validateBusinessRules_example_6(context);

    const cuentaEntity = await this.cuentaRepository.create(data);
    return CuentaEntityToCuentaDtoMapper.mapping(cuentaEntity);
  }

  async validateBusinessRules_example_1(context: CuentaContext) {
    const result = await this.cuentaValidator.validateFast(context);
    if (!result.isValid) {
      result.errors.forEach((e) => {
        console.log('createCuenta2.service :: validateFast :: ', e.message);
      });
    }
  }

  async validateBusinessRules_example_2(context: CuentaContext) {
    await this.cuentaValidator.validateFastThrow(context);
  }

  async validateBusinessRules_example_3(context: CuentaContext) {
    const onError = (e: ErrorResult) => {
      console.log('createCuenta2.service :: onError => ', e.message);
    };

    await this.cuentaValidator.validate(context, { onError: onError, options: { throwOnError: { ruleName: 'all', stopOnError: true } } });
  }

  async validateBusinessRules_example_4(context: CuentaContext) {
    const onError = (e: ErrorResult) => {
      console.log('createCuenta2.service :: onError => ', e.ruleName, e.message);
    };

    await this.cuentaValidator.validate(context, { onError: onError, options: { throwOnError: { ruleName: 'all', stopOnError: false } } });
  }

  async validateBusinessRules_example_5(context: CuentaContext) {
    const onError = (e: ErrorResult) => {
      console.log('createCuenta2.service :: example_5 :: onError => ', e.ruleName, e.message);
    };

    await this.cuentaValidator.validate(context, { 
      onError: onError, 
      options: { 
        throwOnError: { 
          ruleName: 'CuentaNombreLargoRule', 
          stopOnError: true
        } 
      } 
    });
  }

  async validateBusinessRules_example_6(context: CuentaContext) {
    const onError = (e: ErrorResult) => {
      console.log('createCuenta2.service :: example_6 :: onError => ', e.ruleName, e.message);
    };

    await this.cuentaValidator.validate(context, { 
      onError: onError, 
      options: { 
        throwOnError: { 
          ruleName: 'CuentaNombreLargoRule', 
          stopOnError: true,
          throwNew: true
        } 
      } 
    });
  }
}
