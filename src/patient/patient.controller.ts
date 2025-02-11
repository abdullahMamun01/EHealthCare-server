import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { PatientUpdateDto, patientUpdateSchema } from './dto/patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Roles(Role.User)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async updatePatientInfo(
    @UploadedFile('file') files: Express.Multer.File,
    @Request() req: any,
  ) {
    if (typeof req?.body?.patientHealthData === 'string') {
      req.body.patientHealthData = JSON.parse(req.body.patientHealthData);
    }

    if (typeof req?.body?.medicleReports === 'string') {
      req.body.medicleReports = JSON.parse(req.body.medicleReports);
    }

    const validateBody = new ZodValidationPipe(patientUpdateSchema).transform(
      req.body,
      {
        type: 'body',
      },
    );

    return this.patientService.updatePatient(
      validateBody,
      files,
      req.user.patient_id,
    );
  }

  @Roles(Role.User)
  @Delete('medicle-report/:reportId')
  @UseInterceptors(FileInterceptor('file'))
  async deleteMedicleReport(@Request() req: any, @Param('reportId') reportId: string) {
    return this.patientService.deleteMedicReport(req.user.patient_id, reportId);
  }

  @Roles(Role.User)
  @Patch('medicle-report/:reportId')
  async updateMedicleReport(
    @UploadedFile('file') file: Express.Multer.File,
    @Request() req: any,
    @Param('reportId') reportId: string,
  ) {
    return this.patientService.updateMedicleReport(
      reportId,
      req.user.patient_id,
      req.body,
      file,
    );
  }

  @Roles(Role.User)
  @Get('mdeicle-reports')
  async getMedicleReports(@Request()  req: any){
    return this.patientService.getMedicleReports(req.user.patient_id);
  }
}
