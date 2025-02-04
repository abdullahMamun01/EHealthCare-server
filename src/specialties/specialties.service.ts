import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Specialites } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
