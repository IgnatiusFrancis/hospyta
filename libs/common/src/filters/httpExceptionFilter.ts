import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

interface ExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToRpc().getContext();
    const call = ctx.args[0]; // The gRPC call object

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let exceptionResponse: ExceptionResponse;

    if (exception instanceof HttpException) {
      exceptionResponse = {
        statusCode: httpStatus,
        message: exception.message,
        error:
          (exception.getResponse() as any).message || 'Internal server error',
      };
    } else if (exception instanceof PrismaClientKnownRequestError) {
      exceptionResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database error occurred',
        error: 'Prisma Client Known Request Error',
      };
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      exceptionResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown database error occurred',
        error: 'Prisma Client Unknown Request Error',
      };
    } else if (exception instanceof RpcException) {
      exceptionResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: 'gRPC error',
      };
    } else {
      exceptionResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal server error',
      };
    }

    // Log the error for debugging purposes
    console.error({
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: exceptionResponse.message,
      errorResponse: exceptionResponse,
    });

    // Send the error response
    call.emit('error', {
      code: status.UNKNOWN,
      message: exceptionResponse.message,
    });
  }
}
