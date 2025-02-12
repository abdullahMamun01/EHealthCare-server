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
import {
  LoginDto,
  loginSchema,
  RegisterDto,
  registerSchema,
} from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { Public } from './metadata';
import { Role, Roles } from 'src/guard/role/roles.decorator';
import { AuthSwagger } from './swagger/auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSwagger.createUser()
  @Public()
  @Post('signup')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async createUser(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  @AuthSwagger.singinUser()
  @Public()
  @Post('signin')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async signin(@Body() loginDto: LoginDto) {
    return this.authService.signin(loginDto);
  }
}
