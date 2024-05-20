import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { logRed, logYellow } from '../../helpers/string.helper';
import { Response, Request } from 'express';
import { format } from 'date-fns';
export interface ResponseType<T> {
  success: boolean;
  data: T | { message: string };
}

export class LoggingInterceptor<T>
  implements NestInterceptor<T, ResponseType<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseType<T>> {
    const method = _context.switchToHttp().getRequest<Request>()?.method;
    const url = _context.switchToHttp().getRequest<Request>()?.url;
    const host = _context.switchToHttp().getRequest<Request>().headers.host;
    const statusCode = _context
      .switchToHttp()
      .getResponse<Response>().statusCode;
    const protocol = _context.switchToHttp().getRequest<Request>().protocol;
    const currentDate = new Date();
    if (url !== '/api/app/health-check') {
      console.log('\n');
      console.log(
        '[' +
          format(currentDate, 'hh:mm:ss a dd/MM/yyyy') +
          ']' +
          ' - ' +
          logYellow(`[${method}]`) +
          ' - ' +
          logYellow(`${protocol}://${host}${url}`),
      );
    }
    return next.handle().pipe(
      map((data: T): ResponseType<T> => {
        if (url !== '/api/app/health-check') {
          console.log('STATUS CODE: ' + statusCode);
        }
        return {
          success: true,
          data,
        };
      }),
      catchError((error) => {
        console.log(
          'STATUS CODE: ' + error.statusCode ? error.statusCode : 500,
        );
        console.error(error);
        throw error;
      }),
    );
  }
}
