import * as express from 'express';

export abstract class BaseController {
  public successResponse<T>(
    res: express.Response,
    data?: T,
  ): express.Response<T> {
    if (data === undefined) {
      return res.status(200).json({
        success: true,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  }

  public errorResponse<T>(
    res: express.Response,
    data?: T,
  ): express.Response<T> {
    return res.status(500).json({
      success: false,
      ...data,
    });
  }

  public pagingResponse<T>(
    res: express.Response,
    data: { count: number; rows: T[]; [key: string]: any },
  ): express.Response<T> {
    const { count, rows, ...rest } = data;
    return res.status(200).json({
      success: true,
      total: count,
      data: rows,
      ...rest,
    });
  }
}
