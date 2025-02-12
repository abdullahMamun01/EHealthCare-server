import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class MetaService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchMetaData(user: any) {
    switch (user.role) {
      case 'PATIENT':
        const patientMeataData = await this.getPatientMetaData(user);
        return sendResponse({
          status: 200,
          message: 'Successfully fetched meta data',
          data: patientMeataData,
          success: true,
        });
      case 'DOCTOR':
        const doctorMetaData = await this.getDoctorMetaData(user);
        return sendResponse({
          status: 200,
          message: 'Successfully fetched meta data',
          data: doctorMetaData,
          success: true,
        });
      case 'ADMIN':
        const metadata = await this.commonMetaData(user);
        const getAdminMetaData = await this.getAdminMetaData();
        return sendResponse({
          status: 200,
          message: 'Successfully fetched meta data',
          data: {
            ...metadata,
            ...getAdminMetaData,
          },
          success: true,
        });
      default:
        break;
    }
  }

  private async commonMetaData(user: any) {
    const wherConditions = {};
    switch (user.role) {
      case 'PATIENT':
        wherConditions['patientId'] = user.patient_id;
      
        break;
      case 'DOCTOR':
        wherConditions['doctorId'] = user.doctor_id;
        break;
      default:
        break;
    }

    const [
      prescriptionCount,
      reviewCount,
      appointmentCount,
      cancelAppointmentCount,
      completedAppointment,
    ] = await Promise.all([
      this.prismaService.prescription.count({ where: wherConditions }),
      this.prismaService.reviews.count({ where: wherConditions }),
      this.prismaService.appointment.count({ where: wherConditions }),
      this.prismaService.appointment.count({
        where: { ...wherConditions, status: 'CANCELED' },
      }),
      this.prismaService.appointment.count({
        where: { ...wherConditions, status: 'COMPLETED' ,paymentStatus:'COMPLETED' },
      }),
    ]);
    console.log(wherConditions)
    console.log(user.role , completedAppointment)
    return {
      appointmentCount,
      prescriptionCount,
      reviewCount,
      cancelAppointmentCount,
      completedAppointment,
    };
  }

  private async getAppointmentByTimePeriod(groupBy: 'month' | 'year') {
    const dateTruncFormat =
      groupBy === 'month'
        ? 'DATE_TRUNC(\'month\', "createdAt")'
        : 'DATE_TRUNC(\'year\', "createdAt")';

    const appointmentByTimePeriod = await this.prismaService.$queryRaw`
      SELECT 
        ${Prisma.raw(dateTruncFormat)} AS time_period,
        CAST(COUNT(*) AS INTEGER) AS appointments
      FROM 
        "appointments"
      WHERE 
        "status" = 'COMPLETED'
      GROUP BY 
        time_period
      ORDER BY 
        time_period ASC;
    `;

    return (
      appointmentByTimePeriod as { time_period: string; appointments: number }[]
    ).map((data) => ({
      [groupBy]: format(
        data.time_period,
        groupBy === 'month' ? 'yyyy-MM' : 'yyyy',
      ),
      appointments: data.appointments,
    }));
  }

  private async getTotalRevenue() {
    const totalRevenue = await this.prismaService.payments.aggregate({
      where: {
        status: 'COMPLETED',
      },

      _sum: {
        amount: true,
      },
    });

    return totalRevenue;
  }

  private async getPatientMetaData(user: any) {
    return await this.commonMetaData(user);
  }

  private async getDoctorMetaData(user: any) {
    const {
      prescriptionCount,
      reviewCount,
      appointmentCount,
      cancelAppointmentCount,
      completedAppointment,
    } = await this.commonMetaData(user);
    const totalProfit = await this.prismaService.payments.aggregate({
      where: {
        status: 'COMPLETED',
        appointment: {
          doctorId: user.doctor_id,
        },
      },

      _sum: {
        amount: true,
      },
    });

    return {
      prescriptionCount,
      reviewCount,
      appointmentCount,
      cancelAppointmentCount,
      completedAppointment,
      totalProfit,
    };
  }

  private async getProfitByTimePeriod(groupBy: 'month' | 'year') {
    const dateTruncFormat =
      groupBy === 'month'
        ? 'DATE_TRUNC(\'month\', "createdAt")'
        : 'DATE_TRUNC(\'year\', "createdAt")';

    const profitByTimePeriod = await this.prismaService.$queryRaw`
      SELECT 
        ${Prisma.raw(dateTruncFormat)} AS time_period,
        CAST(SUM("amount") AS INTEGER) AS profit
      FROM 
        "payments"
      WHERE 
        "status" = 'COMPLETED'
      GROUP BY 
        time_period
      ORDER BY 
        time_period ASC;
    `;

    return (
      profitByTimePeriod as { time_period: string; profit: number }[]
    ).map((data) => ({
      [groupBy]: data.time_period,
      profit: data.profit,
    }));
  }

  private async getAdminMetaData() {
    const totalRevenue = await this.getTotalRevenue();
    const profitByMonth = await this.getProfitByTimePeriod('month');
    const profitByYear = await this.getProfitByTimePeriod('year');
    const monthlyAppointment = await this.getAppointmentByTimePeriod('month');
    const commonMetaData = this.commonMetaData
    const monthly_appointment = monthlyAppointment.map((data) => ({
      month: format(data.month, 'yyyy-MM'),
      appointments: data.appointments,
    }));
    const yearly_appointment = monthlyAppointment.map((data) => ({
      year: format(data.month, 'yyyy'),
      appointments: data.appointments,
    }));

    const monthly_profit = profitByMonth.map((data) => ({
      month: format(data.month, 'yyyy-MM'),
      profit: data.profit,
    }));

    const yearly_profit = profitByYear.map((data) => ({
      year: format(data.year, 'yyyy'),
      profit: data.profit,
    }));

    return {
      totalRevenue: totalRevenue._sum.amount,
      monthly_appointment,
      yearly_appointment,
      monthly_profit,
      yearly_profit,
    };
  }
}
