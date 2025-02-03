import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateAdminDto, CreateDoctorDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import sendResponse from 'src/utils/sendResponse';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtAuthService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createDoctor(payload: CreateDoctorDto, file?: Express.Multer.File) {

    const isExist = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });
    if (isExist) {
      throw new HttpException('User already exists', HttpStatus.FOUND);
    }

    let photoUrl = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      photoUrl = result.url;
    }
    const transaction = await this.prismaService.$transaction(async (tx) => {
      const hashedPassword = await this.jwtService.hashedPassword(
        payload.password,
      );
      const user = await tx.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          role: 'DOCTOR',
        },
      });
      const { password, ...others } = payload;
      const doctor = await tx.doctor.create({
        data: {
          email: user.email,
          address: payload.address,
          contactNo: payload.contactNo,
          country: payload.country,
          licenseNo: payload.licenseNo,
          name: payload.name,
          gender: payload.gender,
          yearsOfExperience: +payload.yearsOfExperience || 0,
          photo: photoUrl,
        },
      });

      return {
        ...doctor,
        role: user.role,
      };
    });

    return sendResponse({
      status: 201,
      data: transaction,
      message: 'doctor created successfully',
      success: true,
    });
  }

  async createAdmin(payload: CreateAdminDto, file?: Express.Multer.File) {
    const isExist = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });
    if (isExist) {
      throw new HttpException('User already exists', HttpStatus.FOUND);
    }

    let photoUrl = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      photoUrl = result.url;
    }

    const result = await this.prismaService.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: payload.email,
          password: await this.jwtService.hashedPassword(payload.password),
          role: 'ADMIN',
        },
      });

      const adminn = await tx.admin.create({
        data: {
          email: payload.email,
          contactNo: payload.contactNo,
          name: payload.name,
          photo: photoUrl,
        },
      });

      return { ...adminn, role: 'ADMIN' };
    });

    return sendResponse({
      message: 'admin created successfully',
      status: 201,
      data: result,
      success: true,
    });
  }
}
