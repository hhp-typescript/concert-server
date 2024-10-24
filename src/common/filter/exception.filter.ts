import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BusinessException } from '../exception';
import { HttpStatusMap } from './exception.mapper';
import { Request, Response } from 'express';

@Catch(Error)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    let statusCode: HttpStatus;
    const message = exception.message
      ? exception.message
      : 'Internal server error';
    const domain = exception.domain ? exception.domain : 'generic';
    const stack: string = exception.stack || '';

    if (exception instanceof BusinessException) {
      statusCode = HttpStatusMap[exception.code];
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const responseBody = {
      statusCode,
      domain,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `exception: ${JSON.stringify({
        ...responseBody,
      })}`,
      stack,
    );

    response.status(statusCode).json(responseBody);
  }
}
