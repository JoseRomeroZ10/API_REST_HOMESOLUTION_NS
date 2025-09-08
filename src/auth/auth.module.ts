import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
     JwtModule.register({
      global: true,
      secret:process.env.JWT_SECRET ,
    }),
    UsersModule,
  ], 
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
