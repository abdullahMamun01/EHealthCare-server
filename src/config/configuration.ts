import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT as string, 10) || 5000,
  dbURL:  process.env.DATABASE_URL,
  accessToken : process.env.ACCESS_TOKEN_SECRET_KEY,
  accessTokenExpiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN,
}));
