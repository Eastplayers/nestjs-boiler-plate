import { Observable, catchError, map } from 'rxjs';
import { Sequelize, Transaction } from 'sequelize';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  createParamDecorator,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection()
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;

    return next.handle().pipe(
      map(async (data) => {
        await transaction.commit();
        return data;
      }),
      catchError(async (err) => {
        await transaction.rollback();
        throw err;
      }),
    );
  }
}

export const TransactionParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.transaction;
  },
);
