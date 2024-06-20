// custom-exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from '@app/common/enums';

export class EnvValidationException extends HttpException {
  constructor() {
    const responseBody = {
      error: 'MISSING ENV ELEMENTS WITHIN AT LEAST ONE SERVICE',
      errorType: ErrorType.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    super(responseBody, responseBody.statusCode);
  }
}
