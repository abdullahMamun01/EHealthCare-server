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
    const secret = this.configService.get<string>('config.accessToken');
    if (!secret) throw new Error('Missing accessToken secret in config');

    return await this.jwtservice.signAsync(payload, {
      secret,
      expiresIn: this.configService.get<string>('config.accessTokenExpiresIn', '1h'),
    });
  }

  async refreshToken(payload: JwtPayload) {
    const secret = this.configService.get<string>('config.refreshToken');
    if (!secret) throw new Error('Missing refreshToken secret in config');

    return await this.jwtservice.signAsync(payload, {
      secret,
      expiresIn: this.configService.get<string>('config.refreshTokenExpiresIn', '7d'),
    });
  }

  async verifyAccessToken(token: string) {
    const secret = this.configService.get<string>('config.accessToken');
    if (!secret) throw new Error('Missing accessToken secret in config');

    return await this.jwtservice.verifyAsync<JwtPayload>(token, { secret });
  }

  async verifyRefreshToken(token: string) {
    const secret = this.configService.get<string>('config.refreshToken');
    if (!secret) throw new Error('Missing refreshToken secret in config');

    return await this.jwtservice.verifyAsync<JwtPayload>(token, { secret });
  }

  async hashedPassword(password: string) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error(`Hashing password failed: ${error.message}`);
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Comparing passwords failed: ${error.message}`);
    }
  }
}
