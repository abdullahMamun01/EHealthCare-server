import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';


export class AuthSwagger {
  static createUser() {
    return applyDecorators(
      ApiOperation({ summary: 'Create a new user' }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            country: { type: 'string' },
          },
        },
      }),
      ApiResponse({
        status: 201,
        description: 'User created successfully.',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
            status: { type: 'number' },
            data: {
              type: 'object',
              example: {
                data: {
                  name: 'John Doe',
                  email: 'i4m5M@example.com',
                  role: 'patient',
                  id: 1,
                },
              },
            },
          },
        },
      }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    );
  }

  static singinUser() {
    return applyDecorators(
      ApiOperation({ summary: 'Get user details' }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
      }) ,
      ApiResponse({ status: 200, description: 'User fetched successfully' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    );
  }
}
