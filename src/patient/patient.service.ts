import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicleReportsDto, PatientUpdateDto } from './dto/patient.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MedicleReports, PatientHealthData, Prisma } from '@prisma/client';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class PatientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async updatePatient(
    patiendUpdateDto: PatientUpdateDto,
    file: Express.Multer.File,
    patientId: string,
  ) {
    const { patientHealthData, medicleReports } = patiendUpdateDto;

    await this.prismaService.patient.findFirstOrThrow({
      where: {
        id: patientId,
      },
    });
    let reportLink = '';
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      reportLink = result.url;
    }

    if (medicleReports.reportLink) {
      const result = await this.cloudinaryService.uploadImageFromUrl(
        medicleReports.reportLink,
      );
      reportLink = result.url;
    }

    await this.prismaService.$transaction(async (tx) => {
      if (patientHealthData) {
        const patientHealhtData = await this.updateHealthData(
          tx,
          patientHealthData as Prisma.PatientHealthDataCreateInput,
          patientId,
        );
      }

      if (medicleReports) {
        await tx.medicleReports.create({
          data: {
            patientId,
            reportName: medicleReports.reportName,
            reportLink,
          } as MedicleReports,
        });
      }
      return;
    });

    const patientData = await this.prismaService.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        patientHealthData: true,
        medicleReports: true,
      },
    });
    return sendResponse({
      status: 200,
      success: true,
      data: patientData,
      message: 'Patient updated successfully',
    });
  }

  private async updateHealthData(
    tx: Prisma.TransactionClient,
    healthData: Prisma.PatientHealthDataCreateInput,
    patientId: string,
  ) {
    return await tx.patientHealthData.upsert({
      where: {
        patientId,
      },
      update: healthData as Partial<PatientHealthData>,
      create: {
        patientId,
        ...healthData,
      } as PatientHealthData,
    });
  }

  async getPatientById(patientId: string) {
    return this.prismaService.patient.findUniqueOrThrow({
      where: { id: patientId },
      include: {
        patientHealthData: true,
        medicleReports: true,
      },
    });
  }

  async deleteMedicReport(patientId: string, reportId: string) {
    const report = await this.prismaService.medicleReports.findUniqueOrThrow({
      where: { id: reportId },
    });

    // Delete the report
    await this.prismaService.medicleReports.delete({
      where: { id: reportId },
    });

    // Return the response
    return sendResponse({
      status: 200,
      success: true,
      data: report,
      message: 'Report deleted successfully',
    });
  }

  async updateMedicleReport(
    reportId: string,
    patientId: string,
    updateReportDto: MedicleReportsDto,
    file: Express.Multer.File,
  ) {
    const report = await this.prismaService.medicleReports.findUniqueOrThrow({
      where: { id: reportId, patientId },
    });

    if (updateReportDto.reportLink) {
      const result = await this.cloudinaryService.uploadImageFromUrl(
        updateReportDto.reportLink,
      );
      updateReportDto.reportLink = result.url;
    }

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      updateReportDto.reportLink = result.url;
    }

    const updateReport = await this.prismaService.medicleReports.update({
      where: { id: reportId, patientId },
      data: {
        reportLink: updateReportDto.reportLink,
        reportName: updateReportDto.reportName,
      },
    });

    return sendResponse({
      status: 200,
      success: true,
      data: updateReport,
      message: 'Report updated successfully',
    });
  }

  async getMedicleReports(patientId: string) {
    const reports = await this.prismaService.medicleReports.findMany({
      where: { patientId },
    });
    return sendResponse({
      status: 200,
      success: true,
      data: reports,
      message: 'Report retrieved successfully',
    });
  }
}
