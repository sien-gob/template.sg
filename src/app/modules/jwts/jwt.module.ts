import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/system/configs';

@Module({
  imports: [
    JwtModule.register({
      secret: envs.keys.jwt,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
