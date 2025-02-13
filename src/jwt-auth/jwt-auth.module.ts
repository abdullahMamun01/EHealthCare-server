import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthService],
})
export class JwtAuthModule {}
