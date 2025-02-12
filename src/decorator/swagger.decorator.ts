import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCommonResponse(summary: string, model: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success', type: model }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  );
}
