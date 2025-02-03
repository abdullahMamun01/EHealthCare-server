import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private configService: ConfigService,
  ) {}
  async accessToken(payload: any) {
    const token = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get('config.accessToken'),
      expiresIn: this.configService.get('config.accessTokenExpiresIn'),
    });
    return token;
  }

  async refreshToken(payload: any) {
    const token = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get('config.refreshToken'),
      expiresIn: this.configService.get('config.refreshTokenExpiresIn'),
    });
    return token;
  }

  async verifyAccessToken(token: string) {
    return await this.jwtservice.verifyAsync(token, {
      secret: this.configService.get('config.accessToken'),
    });
  }

  async verifyRefresToken(token: string) {
    return await this.jwtservice.verifyAsync(token, {
      secret: this.configService.get('config.refreshToken'),
    });
  }

  async hashedPassword(password: string) {
    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);

      return hashed;
    } catch (error) {
      console.log(error.message, 'hello');
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
