import { Module } from '@nestjs/common';
import { AuthenticationService, LoginService, UserHasPermissionService } from './application/services';
import { GetRolesByIdMockAdapter, GetUserByNameMockAdapter, GetUserRolesByIdMockAdapter } from './infrastructure/adapters/repositories';
import { JwtConfigModule } from '../jwts/jwt.module';

import { AuthenticationLocalServiceAdapter, LoginLocalServiceAdapter } from './infrastructure/adapters/services';
import { LoginController } from './infrastructure/controllers';
import { SyslogModule } from '../syslogs/syslog.module';
import { LoginBusinessValidator, LoginRule } from './application/validations';


@Module({
  imports: [JwtConfigModule, SyslogModule],
  controllers: [LoginController],
  providers: [
    {
      provide: 'IGetRolesByIdRepository',
      useClass: GetRolesByIdMockAdapter,
    },
    {
      provide: 'IGetUserRolesRepository',
      useClass: GetUserRolesByIdMockAdapter,
    },
    {
      provide: 'IGetUserByNameRepository',
      useClass: GetUserByNameMockAdapter,
    },

    {
      provide: 'ILoginServicePort',
      useClass: LoginLocalServiceAdapter,
    },
    {
      provide: 'IAuthenticationServicePort',
      useClass: AuthenticationLocalServiceAdapter,
    },
    
    LoginRule,
    LoginBusinessValidator,

    UserHasPermissionService,
    LoginService,
    AuthenticationService,
  ],
  exports: [UserHasPermissionService, AuthenticationService],
})
export class AccessModule {}
