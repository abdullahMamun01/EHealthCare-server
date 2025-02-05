import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { DoctorSpecialtiesDto } from './dto/doctor-speciality.dto';
@Injectable()
export class DoctorService {
  constructor(
    private readonly prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {
    this.paginationService.setModel('doctor');
  }

  async getAllDoctors(query: Record<string, unknown>) {
    const search = query.searchTerm || '';
    return await this.paginationService
      .paginate(query)
      .search(search as string, ['name'])
      .nestedFilters('specialities')
      .execute({
        doctorSpecielites: {
          include: {
            doctorId: false,
            specialitesId: false,
            createdAt: false,
            updatedAt: false,
            specialites: true,
          },
        },
      });
  }

  // async createAppointment() {}

  // async updateAppointment() {}
  async createSpeciality(specialities: DoctorSpecialtiesDto, doctorId: string) {
    const doctorExists = await this.prismaService.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctorExists) {
      throw new HttpException(
        `Doctor with ID ${doctorId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const specialitesIds = specialities
      .filter((id) => id.isDeleted === false)
      .map((id) => id.specialtiesId);

    const docSpecialities = await this.prismaService.doctorSpecielites.findMany(
      {
        where: {
          specialitesId: {
            in: specialitesIds,
          },
        },
      },
    );

    if (docSpecialities.length > 0) {
      throw new HttpException('Speciality already exists', HttpStatus.CONFLICT);
    }
    const deleteSpecialtiesIds = specialities
      .filter((id) => id.isDeleted === true)
      .map((id) => id.specialtiesId);

    const transaction = await this.prismaService.$transaction(async (tx) => {
      if (deleteSpecialtiesIds.length > 0) {
        await tx.doctorSpecielites.deleteMany({
          where: {
            specialitesId: {
              in: deleteSpecialtiesIds,
            },
          },
        });
      }

      if (specialitesIds.length > 0) {
        const createSpecialities = await tx.doctorSpecielites.createMany({
          data: specialitesIds.map((id) => ({ specialitesId: id, doctorId })),
          skipDuplicates: true,
        });
        return createSpecialities;
      }
      return null;
    });

    return sendResponse({
      message: 'Specialities updated successfully',
      data: transaction,
      success: true,
      status: 200,
    });
  }
  // async deleteAppointment() {}
}
