import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, registerSchema } from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async createUser(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }
}
