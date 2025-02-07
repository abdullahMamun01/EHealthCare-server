import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtcRole, RtcTokenBuilder } from 'agora-token';
import sendResponse from 'src/utils/sendResponse';
import { v4 as uuidv4 } from 'uuid';

export type RtRole = 'publisher' | 'subscriber';

@Injectable()
export class AgoraService {
  private appId: string;
  private appCertificate: string;
  constructor(private readonly configService: ConfigService) {
    this.appId = this.configService.get('config.agoraAppId');
    this.appCertificate = this.configService.get('config.agoraCertificate');
  }

  generateRtcToken(
    channelName: string,
    role: RtRole,
    uid: string,
    expireTimeInSeconds: number = 3600,
  ) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;
    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      RtcRole[role],
      expireTimeInSeconds,
      privilegeExpiredTs,
    );
    return sendResponse({
      message: 'Token generated successfully',
      data: {
        token,
        channelName : `${channelName}-${uid}`,
        uid,
      },
      success: true,
      status: 200,
    });
  }
}
