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
      const password = await this.jwtService.hashedPassword(payload.password);
      await tx.user.create({
        data: {
          email: payload.email,
          password,
          needPasswordChange: false,
        },
      });
      const patient = await tx.patient.create({
        data: {
          email: payload.email,
          name: payload.name,
          country: payload.country,
        },
      });
      return patient;
    });

    return sendResponse({
      status: 201,
      success: true,
      message: 'User created successfully',
      data: transaction,
    }); // Return the created user instead of just the email
  }

  async signin(payload: LoginDto) {

    const isExist = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!isExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService[
      isExist.role.toLowerCase()
    ].findUnique({
      where: {
        email: isExist.email,
      },
    });

    const isPasswordMatch = await this.jwtService.comparePassword(
      payload.password,
      isExist.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.accessToken({
      id: isExist.id,
      [`${isExist.role.toLowerCase()}_id`]: user.id,
      email: isExist.email,
      role: isExist.role,
      name: user.name,
    });
    const result = sendResponse({
      status: 200,
      success: true,
      message: 'User Login successfully',
      data: {
        ...user,
        role: isExist.role,
      },
    });
    return {
      ...result,
      accessToken: token,
    };
  }
}
