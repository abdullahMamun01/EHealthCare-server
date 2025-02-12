import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtConfigModule } from './jwt-auth/JwtConfigModule';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/AuthGuard';
import { RolesGuard } from './guard/role/RoleGuard';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { PaginationModule } from './pagination/pagination.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module';
import { AgoraModule } from './agora/agora.module';
import { StripeService } from './stripe/stripe.service';
import { StripeModule } from './stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { MetaModule } from './meta/meta.module';

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
    PatientModule,
    UserModule,
    PaginationModule,
    SpecialtiesModule,
    AppointmentModule,
    ScheduleModule,
    DoctorScheduleModule,
    AgoraModule,
    StripeModule,
    PaymentModule,
    ReviewModule,
    PrescriptionModule,
    MetaModule,
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
    StripeService,
  ],
})
export class AppModule {}
