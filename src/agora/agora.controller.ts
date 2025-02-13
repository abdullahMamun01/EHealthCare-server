import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AgoraService, RtRole } from './agora.service';
import { Public } from 'src/auth/metadata';

import { ZodValidationPipe } from 'src/others/zodValidationPipe';
import { GenerateTokenDto, generateTokenSchema } from './dto/generate-toke.dto';

@Controller('agora')
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {}
  @Public()
  @Post('token/generate-token')
  @UsePipes(new ZodValidationPipe(generateTokenSchema))
  generateRtcToken(@Body() body: GenerateTokenDto) {
    const { channelName, role = 'PUBLISHER', uid, expireTimeInSeconds } = body;

    return this.agoraService.generateRtcToken(
      channelName,
      role as RtRole,
      uid,
      expireTimeInSeconds,
    );
  }
}
