import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string;

    if (exception instanceof RpcException) {
      const rpcMessage = exception.getError();
      message =
        typeof rpcMessage === 'object'
          ? (rpcMessage as any).message
          : rpcMessage;
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      message = (exception as Error).message || 'Internal server error';
    }

    this.logger.error(`HTTP Status: ${status} Error Message: ${message}`);

    console.log(message);
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    };
  }
}
