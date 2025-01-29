import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.accessToken'),
        signOptions: {
          expiresIn: configService.get('config.accessTokenExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule], // Ensure JwtModule is exported
})
export class JwtConfigModule {}
