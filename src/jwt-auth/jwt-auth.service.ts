import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private configService: ConfigService,
  ) {}
  async accessToken(payload: JwtPayload) {
    const token = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get('config.accessToken'),
      expiresIn: this.configService.get<string>('config.accessTokenExpiresIn'),
    });
    return token;
  }

  async refreshToken(payload: JwtPayload) {
    const token = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get('config.refreshToken'),
      expiresIn: this.configService.get<string>('config.refreshTokenExpiresIn'),
    });
    return token;
  }

  async verifyAccessToken(token: string) {
    return await this.jwtservice.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('config.accessToken'),
    });
  }

  async verifyRefresToken(token: string) {
    return await this.jwtservice.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('config.refreshToken'),
    });
  }

  async hashedPassword(password: string) {
    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);

      return hashed;
    } catch (error) {
      const err = error as Error;
      console.log(err.message, 'hello');
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
