import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';

@Module({
  imports: [JwtAuthModule , JwtModule],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthService],
})
export class AuthModule {}
