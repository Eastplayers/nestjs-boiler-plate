import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';

@Controller('/app')
@ApiTags('App Health Check')
export class AppController {
  @Get('/health-check')
  async healthCheck(@Res() response: express.Response) {
    return response.status(200).json('OK');
  }
}
