import { Response } from 'express';
import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { AppException, ErrorResponseDto } from '../base/base.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionFilter.name);
  catch(exception: Error & { [key: string]: any }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(exception.message, exception.stack);
    if (exception.name === 'AxiosError') {
      const { response: axiosRes } = exception;
      return response.status(axiosRes.status).json(axiosRes.data);
    }
    if (
      exception.message &&
      exception.message.includes(`${process.env.DB_HOST}`)
    ) {
      exception.message = 'Internal server error. Please try again later';
    }
    return response
      .status(exception['statusCode'] ?? 500)
      .json(
        new ErrorResponseDto(
          new AppException(
            exception.message,
            exception?.['code'],
            exception?.['statusCode'],
            exception?.['data'],
          ),
        ),
      );
  }
}
