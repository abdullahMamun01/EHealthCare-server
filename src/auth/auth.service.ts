import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtAuthService,
    private prismaService: PrismaService,
  ) {}

  async signup(payload: RegisterDto) {
    const isExist = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (isExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const transaction = await this.prismaService.$transaction(async (tx) => {
      const password = await this.jwtService.hashedPassword(payload.password)
      console.log(password, 'oooo')
      const user = await tx.user.create({
        data: {
          email: payload.email,
          password
        },
      });
      const patient = await tx.patient.create({
        data: {
          email: payload.email,
          name: payload.name,
          country: payload.country,
        },
      });
      return {
        user,
        patient,
      };
    });

    return transaction; // Return the created user instead of just the email
  }

  async signin(payload: LoginDto) {
    const isExist = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!isExist) {
      throw new Error('User already exists');
    }

    const user = await this.prismaService.patient.findUnique({
      where: {
        email: isExist.email,
      },
    });

    const token = await this.jwtService.accessToken({
      email: isExist.email,
      role: isExist.role,
      name: user.name,
    });

    return sendResponse({
      status: 200,
      success: true,
      message: 'User Login successfully',
      data: {
        accessToken: token,
        user,
        role: isExist.role,
      },
    });
  }
}
