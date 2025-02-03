import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [JwtAuthModule, JwtModule, CloudinaryModule],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthService, CloudinaryService],
})
export class AdminModule {}
