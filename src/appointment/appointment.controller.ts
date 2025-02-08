import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { AppointmentDto, appointmentSchema } from './dto/appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Roles(Role.User)
  @Post()
  @UsePipes(new ZodValidationPipe(appointmentSchema))
  async createAppointment(
    @Request() req: any,
    @Body() appointmentDto: AppointmentDto,
  ) {
    return this.appointmentService.createAppointment(
      appointmentDto,
      req.user.patient_id,
    );
  }
  @Roles(Role.User)
  @Patch(':appointmentId')
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Request() req: any,
  ) {
    return this.appointmentService.cancelAppointment(
      appointmentId,
      req.user,
    );
  }


  @Get()
  async allAppointments(@Request() req: any) {
    return this.appointmentService.getAllAppointments(req.user.role, req.user, req.query)
  }
}
