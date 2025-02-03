import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';

import configuration from './config/configuration';
import { JwtAuthService } from './jwt-auth/jwt-auth.service';
import { JwtConfigModule } from './jwt-auth/JwtConfigModule';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/AuthGuard';
import { RolesGuard } from './guard/role/RoleGuard';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtConfigModule,
    PrismaModule,
    AdminModule,
    CloudinaryModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
