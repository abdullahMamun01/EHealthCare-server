import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {

    return 'Hello World! \t' 
  }
}
