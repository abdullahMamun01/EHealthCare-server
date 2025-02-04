import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Specialites } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class SpecialtiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createSpecility(payload: Specialites, file?: Express.Multer.File) {
    const specility = await this.prismaService.specialites.findUnique({
      where: { name: payload.name },
    });
    if (specility) {
      throw new HttpException('Specility already exists', HttpStatus.FOUND);
    }

    let icon = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      icon = result.url;
    }

    const data = this.prismaService.specialites.create({
      data: { ...payload, icon },
    });
    return data;
  }

  async getAllSpecilities() {
    const specilities = await this.prismaService.specialites.findMany({});
    return sendResponse({
      data: specilities,
      message: 'Specilities retrieved successfully',
      success: true,
      status: 200,
    });
  }

  async deleteSpecility(specilityId: string) {
    const speciality = await this.prismaService.specialites.findUnique({
      where: { id: specilityId },
    });

    if (!speciality) {
      throw new HttpException('Specility not found', HttpStatus.NOT_FOUND);
    }

    const data = await this.prismaService.specialites.delete({
      where: { id: specilityId },
    });
    return sendResponse({
      message: 'Specility deleted successfully',
      data,
      success: true,
      status: 200,
    });
  }
}
