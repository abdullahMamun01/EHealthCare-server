import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
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

  uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (err: any, result: any) => {
          if (err) reject(new Error(err.message as string));

          resolve(result);
        },
      );
      const readStream: Readable = streamifier.createReadStream(file.buffer);
      return readStream.pipe(upload);
    });
  }

  uploadImageFromUrl(
    url: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.upload(url);
  }
}
