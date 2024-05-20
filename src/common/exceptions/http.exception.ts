import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException, ErrorResponseDto } from '../base/base.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);
  catch(
    exception: HttpException | (HttpException & { response }),
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const data = exception.getResponse();
    this.logger.error(exception.message, exception.stack);
    const error = new AppException(null, 'http-exception', status);
    if (exception.name === 'AxiosError') {
      //@ts-ignore
      const { response: axiosRes } = exception;
      return response.status(axiosRes.status).json(axiosRes.data);
    }
    if (typeof data === 'string') {
      error.message = data;
    } else if (data.hasOwnProperty('message')) {
      error.message = data['message'];
    } else if (error.message.includes(`${process.env.DB_HOST}`)) {
      error.message = 'Internal server error. Please try again later';
    } else {
      error.message =
        'exception that occurred during the processing of HTTP requests';
      error.data = data;
    }
    response
      .status(error.statusCode || 500)
      .json(
        new ErrorResponseDto(
          new AppException(
            error.message,
            error?.['code'],
            error?.['statusCode'],
            error?.['data'],
          ),
        ),
      );
  }
}
