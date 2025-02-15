import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Prisma  } from '../prisma';
import { Response } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError , PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof ZodError) {
      response.status(400).json({
        statusCode: 400,
        message: 'Validation failed. Please check the provided data.',
        errors: exception.errors.map((error) => ({
          path: error.path.join('.'),
          message: error.message,
        })),
        success: false,
      });
    } else if (exception instanceof PrismaClientKnownRequestError) {
      console.log(exception.code);
      this.logger.error(`Prisma Error: ${exception.message}`);
      console.log(exception.code);
      let message = '';
      switch (exception.code) {
        case 'P2000':
          message = 'Invalid input data. Please check the provided values.';
          break;
        case 'P2025':
          message = 'The requested resource was not found.';
          break;
        case 'P2002':
          message =
            'A record with this value already exists. Please use a different value.';
          break;
        case 'P2003':
          message =
            'Invalid reference to another entity. Ensure the related record exists.';
          break;
        case 'P2001':
          message = 'The specified record does not exist.';
          break;
        default:
          message = `Database error: ${exception.message}`;
      }

      response.status(400).json({
        statusCode: 400,
        message,
        success: false,
        errorCode: exception.code,
      });
    } else if (exception instanceof PrismaClientValidationError) {
      response.status(400).json({
        statusCode: 400,
        message: 'Validation failed. Please check the provided data.',
        success: false,
      });
    }

    // Default error handling for other cases
    this.logger.error(exception?.message || 'Unexpected error');
    response.status(status).json({
      statusCode: status,
      message: exception?.message || 'Internal Server Error',
    });
  }
}
