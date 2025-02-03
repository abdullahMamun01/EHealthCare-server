import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Patient, Doctor, Admin } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateProfile(
    payload: Partial<Patient | Doctor | Admin>,
    email: string,
    file: Express.Multer.File,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    let updatePhoto: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      updatePhoto = result.url;
    }
    const updateUser = await this.prismaService[user.role.toLowerCase()].update(
      {
        where: {
          email,
        },
        data: { ...payload, ...(updatePhoto && { photo: updatePhoto }) },
      },
    );

    return sendResponse({
      status: 200,
      success: true,
      data: updateUser,
      message: 'User updated successfully',
    });
  }
}
