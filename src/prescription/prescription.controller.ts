import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { prescriptionSchema } from './dto/prescription.dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Roles(Role.Doctor, Role.User, Role.Admin)
  @Get()
  async getAllPrescriptions(@Request() req: any, @Query() query: any) {
    return await this.prescriptionService.getAllPrescriptions(query, req.user);
  }

  @Roles(Role.Doctor)
  @Post()
  @UsePipes(new ZodValidationPipe(prescriptionSchema))
  async createPrescription(@Request() req: any, @Body() body: any) {
    return await this.prescriptionService.createPrescription(body, req.user.doctor_id);
  }

  @Roles(Role.Doctor)
  @Patch(':prescriptionId')
  async updatePrescriptionById(
    @Param('prescriptionId') id: string,
    @Request() req: any,
    @Body(new ZodValidationPipe(prescriptionSchema.partial())) body: any,
  ) {
    return await this.prescriptionService.updatePrescription(
      id,
      body,
      req.user.doctor_id,
    );
  }
}
