import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // catches HttpException and any other thrown error
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();
      // payload can be string | object | Validation error array
      if (typeof payload === 'string') {
        message = payload;
        error = exception.name;
      } else if (payload && typeof payload === 'object') {
        const p = payload as any;
        message = p.message ?? exception.message;
        error = p.error ?? exception.name;
      }
    }

    const normalizedMessage = Array.isArray(message)
      ? message
      : [String(message)];

    res.status(status).json({
      statusCode: status,
      error,
      message: normalizedMessage,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
