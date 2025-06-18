import { Module } from '@nestjs/common';
import { CreateCuentaService, GetCuentaByCodigoService, UpdateCuentaService } from './application/services';
import { CreateCuentaController, GetCuentaByCodigoController, UpdateCuentaController } from './infrastructure/controllers';
import { CreateCuentaMemoryAdapter, GetCuentaByCodigoMemoryAdapter, UpdateCuentaMemoryAdapter } from './infrastructure/adapters/repositories';
import { CreateCuentaResolver, GetCuentaByCodigoResolver, UpdateCuentaResolver } from './infrastructure/resolvers';
import { AccessModule } from 'src/app/modules/access/access.module';
import { CuentaBusinessValidator, CuentaCodigoUnicoRule, CuentaNombreLargoRule, CuentaUltimoNivelRule } from './application/validations';

@Module({
  imports: [AccessModule],

  controllers: [GetCuentaByCodigoController, CreateCuentaController, UpdateCuentaController],
  providers: [
    {
      provide: 'IGetCuentaByCodigoRepository',
      useClass: GetCuentaByCodigoMemoryAdapter,
    },
    {
      provide: 'ICreateCuentaRepository',
      useClass: CreateCuentaMemoryAdapter,
    },
    {
      provide: 'IUpdateCuentaRepository',
      useClass: UpdateCuentaMemoryAdapter,
    },

    GetCuentaByCodigoService,
    CreateCuentaService,
    UpdateCuentaService,
    GetCuentaByCodigoResolver,
    CreateCuentaResolver,
    UpdateCuentaResolver,

    CuentaCodigoUnicoRule,
    CuentaNombreLargoRule,
    CuentaUltimoNivelRule,
    CuentaBusinessValidator,
  ],
  exports: [],
})
export class CuentaModule {}
