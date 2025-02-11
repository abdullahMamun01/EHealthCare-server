import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  constructor(private readonly configarationService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configarationService.get('config.cloudinaryCloudName'),
      api_key: this.configarationService.get('config.cloudinaryApikey'),
      api_secret: this.configarationService.get('config.cloudinarySecretkey'),
    });
  }
/* 

cloudinaryApikey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecretkey: process.env.CLOUDINARY_API_SECRET,
*/
  uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (err: any, result: any) => {
          if (err) reject(err);

          resolve(result);
        },
      );
      return streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  uploadImageFromUrl(
    url: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.upload(url);
  }
}
