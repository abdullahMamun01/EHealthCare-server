import { Module } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService,CloudinaryService],
})
export class SpecialtiesModule {}
