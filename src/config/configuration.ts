import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT as string, 10) || 5000,
  dbURL: process.env.DATABASE_URL,
  accessToken: process.env.ACCESS_TOKEN_SECRET_KEY,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApikey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecretkey: process.env.CLOUDINARY_API_SECRET,
  agoraAppId: process.env.AGORA_APP_ID,
  agoraCertificate: process.env.AGORA_APP_CERTIFICATE
}));
