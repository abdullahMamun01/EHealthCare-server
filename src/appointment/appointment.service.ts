import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentDto } from './dto/appointment.dto';
import { Appointment } from '@prisma/client';
import { v4 as uuid4 } from 'uuid';
import sendResponse from 'src/utils/sendResponse';

import { PaginationService } from 'src/pagination/pagination.service';
import { subMinutes } from 'date-fns';
import { JwtPayload } from 'src/jwt-auth/jwt.interface';
@Injectable()
export class AppointmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
  ) {
    this.paginationService.setModel('appointment');
  }

  async createAppointment(payload: AppointmentDto, patientId: string) {
    // await this.prismaService.appointment.deleteMany()
    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
        status: {
          not: 'CANCELED',
        },
      },
    });
    if (appointment) {
      throw new HttpException(
        'Appointment already exists for the given doctor and schedule.',
        HttpStatus.CONFLICT,
      );
    }

    const transaction = await this.prismaService.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: payload.doctorId,
          problemDescription: payload?.problemDescription || '',
          videoCallingId: uuid4(),
          scheduleId: payload.scheduleId,
        } as Appointment,
      });

      await tx.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
          },
        },
        data: {
          appointmentId: appointment.id,
        },
      });

      return appointment;
    });

    return sendResponse({
      message: 'Appointment created successfully',
      data: transaction,
      success: true,
      status: 200,
    });
  }
  async cancelAppointment(appointmentId: string, patient_id: string) {
    const appointment = await this.prismaService.appointment.findUniqueOrThrow({
      where: { id: appointmentId, patientId: patient_id },
    });
    if (appointment.status !== 'CONFIRMED') {
      throw new HttpException(
        'Appointment is not CONFIRMED',
        HttpStatus.BAD_REQUEST,
      );
    }
    const transaction = await this.prismaService.$transaction(async (tx) => {
      const cancelAppointment = await tx.appointment.update({
        where: {
          id: appointmentId,
          patientId: patient_id,
        },
        data: {
          status: 'CANCELED',
        },
      });

      await tx.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: cancelAppointment.doctorId,
            scheduleId: cancelAppointment.scheduleId,
          },
        },
        data: {
          appointmentId: null,
          isBooked: false,
        },
      });

      return cancelAppointment;
    });

    return sendResponse({
      message: 'Appointment canceled successfully',
      data: transaction,
      success: true,
      status: 200,
    });
  }

  async cancelAllPendingAppointment() {
    await this.prismaService.$transaction(async (tx) => {
      // Fetch pending appointments
      const findPendingAppointments = await tx.appointment.findMany({
        where: {
          status: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: {
            lte: subMinutes(new Date(), 29),
          },
        },
        select: {
          id: true,
          doctorId: true,
          scheduleId: true,
        },
      });

      // Extract ids
      const appointmentIds = findPendingAppointments.map(
        (appointment) => appointment.id,
      );
      const doctorAndScheduleIds = findPendingAppointments.map(
        (appointment) => ({
          doctorId: appointment.doctorId,
          scheduleId: appointment.scheduleId,
        }),
      );

      // Update all pending appointments
      await tx.appointment.updateMany({
        where: {
          id: { in: appointmentIds },
        },
        data: {
          status: 'CANCELED',
        },
      });

      await tx.doctorSchedules.updateMany({
        where: {
          OR: doctorAndScheduleIds.map((appointment) => ({
            doctorId: appointment.doctorId,
            scheduleId: appointment.scheduleId,
          })),
        },
        data: {
          isBooked: false,
          appointmentId: null,
        },
      });
    });

    return sendResponse({
      message: 'All pending appointments have been canceled',
      data: [],
      success: true,
      status: 200,
    });
  }

  async markCompletedAppointments() {
    const appointments = await this.prismaService.appointment.updateMany({
      where: {
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        schedule: {
          endTime: {
            lte: new Date(),
          },
        },
      },
      data: {
        status: 'COMPLETED',
      },
    });

    return sendResponse({
      message: 'All confirmed appointments have been updated',
      data: appointments,
      success: true,
      status: 200,
    });
  }

  async getAllAppointments(
    role: any,
    user: JwtPayload,
    query: Record<string, unknown>,
  ) {
    const filterConditions = [];
    if (role === 'PATIENT') {
      filterConditions.push({
        fieldName: 'patientId',
        value: user?.patient_id,
      });
    } else if (role === 'DOCTOR') {
      filterConditions.push({
        fieldName: 'doctorId',
        value: user.doctor_id,
      });
    }

    return await this.paginationService
      .paginate(query)
      .find(filterConditions)
      .execute();
  }
}
