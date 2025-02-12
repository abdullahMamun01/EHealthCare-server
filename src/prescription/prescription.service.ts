import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { prescriptionDto } from './dto/prescription.dto';
import sendResponse from 'src/utils/sendResponse';
import { Prescription } from '@prisma/client';

@Injectable()
export class PrescriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {
    this.paginationService.setModel('prescription');
  }

  async getAllPrescriptions(query: Record<string, unknown>, user: any) {
    const filterConditions = [];
    if (user.role === 'DOCTOR') {
      filterConditions.push({
        fieldName: 'doctorId',
        value: user.doctor_id,
      });
    } else if (user.role === 'PATIENT') {
      filterConditions.push({
        fieldName: 'patientId',
        value: user.patient_id,
      });
    }
    return await this.paginationService
      .paginate(query)
      .find(filterConditions)
      .execute();
  }

  async createPrescription(payload: prescriptionDto, doctorId: string) {
    const appointment = await this.prismaService.appointment.findUniqueOrThrow({
      where: {
        id: payload.appointmentId,
        doctorId,
        status: { in: ['COMPLETED', 'ONGOING'] },
      },
    });

    const hasPrescription = await this.prismaService.prescription.findFirst({
      where: {
        appointmentId: payload.appointmentId,
        doctorId,
      },
    });

    if (hasPrescription) {
      throw new HttpException(
        'Prescription already exists for this appointment',
        HttpStatus.CONFLICT,
      );
    }

    const prescription = await this.prismaService.prescription.create({
      data: {
        ...payload,
        doctorId,
        patientId: appointment.patientId,
        appointmentId: payload.appointmentId,
      } as Prescription,
    });

    return sendResponse({
      message: 'Prescription created successfully',
      data: prescription,
      status: 201,
      success: true,
    });
  }

  async updatePrescription(
    id: string,
    payload: Partial<prescriptionDto>,
    doctorId: string,
  ) {
    await this.prismaService.prescription.findUniqueOrThrow({
      where: { id, doctorId },
    });

    const updatePrescription = await this.prismaService.prescription.update({
      where: { id, doctorId },
      data: payload,
    });

    return sendResponse({
      message: 'Prescription updated successfully',
      data: updatePrescription,
      status: 200,
      success: true,
    });
  }
}
