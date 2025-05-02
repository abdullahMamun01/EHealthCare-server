import { Controller, Post, Body, UsePipes, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  loginSchema,
  RegisterDto,
  registerSchema,
} from './dto/create-auth.dto';
import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { Public } from './metadata';

import { AuthSwagger } from './swagger/auth.swagger';
import { Response } from 'express';


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
  async signin( @Res({ passthrough: true }) response: Response,@Body() loginDto: LoginDto) {
    const user = await this.authService.signin(loginDto);
    if (user) {
      response.cookie('token', user.accessToken, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: true, // Set to true in production
        maxAge: 24 * 3600 * 1000, // 1 day expiration
      });
    }
    return user
  }
}
