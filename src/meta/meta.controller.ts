import { Controller, Get, Request } from '@nestjs/common';
import { MetaService } from './meta.service';
import { Public } from 'src/auth/metadata';
import { Role, Roles } from 'src/guard/role/roles.decorator';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}
  @Roles(Role.User, Role.Doctor, Role.Admin)
  @Get()
  async getMetaData(@Request() req: any ) {

    return this.metaService.fetchMetaData(req.user)
  }
}
