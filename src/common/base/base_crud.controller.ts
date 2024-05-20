import * as _ from 'lodash';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import {
  ArgumentMetadata,
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from './base.controller';
import { BaseModuleService } from './base.service';
import { BaseModel } from './base.model';
import { SuccessResponseDto } from './base.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  TransactionInterceptor,
  TransactionParam,
} from '../interceptors/transaction.interceptor';
import { Type } from 'typescript';

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: { body?: Type; query?: Type; param?: Type },
  ) {
    super(options);
  }
  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }
    return super.transform(value, { ...metadata, metatype: targetType });
  }
}

export function BaseCrudController({
  modelName,
  filterType,
  listResponseType,
  detailResponseType,
  createPayloadType,
  updatePayloadType,
}) {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: createPayloadType },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updatePayloadType },
  );
  const queryPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { query: filterType },
  );

  @Controller('/v1/' + _.kebabCase(modelName))
  @ApiTags(modelName)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  class BaseCrudController extends BaseController {
    service: BaseModuleService<BaseModel>;

    @Get()
    @ApiOperation({ summary: 'Get list ' + modelName })
    @ApiQuery({ type: () => filterType })
    @UsePipes(queryPipe)
    @ApiOkResponse({ type: () => listResponseType })
    async getList(@Res() res: Response, @Query() query: any) {
      const {
        offset,
        limit,
        sort_by,
        sort_order,
        passIncludeOnCount,
        // activate_state,
        ...condition
      } = query;
      const data = await this.service.findList(condition, {
        limit,
        offset,
        sort_by,
        sort_order,
        passIncludeOnCount,
      });
      return this.pagingResponse(res, data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get detail ' + modelName })
    @ApiOkResponse({ type: () => detailResponseType })
    async getDetail(@Res() res: Response, @Param('id') id: string) {
      const data = await this.service.findById(id, {
        include_deleted: true,
      });
      return this.successResponse(res, data);
    }

    @Post()
    @UsePipes(createPipe)
    @ApiOperation({ summary: 'Create ' + modelName })
    @ApiBody({ type: () => createPayloadType })
    @ApiOkResponse({ type: () => detailResponseType })
    @UseInterceptors(TransactionInterceptor)
    async create(
      @Req() req: Request,
      @Res() res: Response,
      @Body() payload: typeof createPayloadType,
      @TransactionParam() transaction: Transaction,
    ) {
      const result = await this.service.create(payload, { transaction });
      return this.successResponse(res, result);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update ' + modelName })
    @UsePipes(updatePipe)
    @ApiBody({ type: () => updatePayloadType })
    @ApiOkResponse({ type: () => detailResponseType })
    @UseInterceptors(TransactionInterceptor)
    async update(
      @Res() res: Response,
      @Param('id') id: string,
      @Body() payload: typeof updatePayloadType,
      @TransactionParam() transaction: Transaction,
    ) {
      const result = await this.service.update(id, payload, { transaction });
      return this.successResponse(res, result);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete ' + modelName })
    @ApiOkResponse({ type: SuccessResponseDto })
    @UseInterceptors(TransactionInterceptor)
    async delete(
      @Res() res: Response,
      @Param('id') id: string,
      @TransactionParam() transaction: Transaction,
    ) {
      await this.service.delete(id, { transaction });
      return this.successResponse(res);
    }

    // @Put(':id/restore')
    // @ApiOperation({ summary: 'Recover ' + modelName })
    // @ApiOkResponse({ type: SuccessResponseDto })
    // @UseInterceptors(TransactionInterceptor)
    // async restore(
    //   @Res() res: Response,
    //   @Param('id') id: string,
    //   @TransactionParam() transaction: Transaction,
    // ) {
    //   await this.service.restore(id, { transaction });
    //   return this.successResponse(res);
    // }
  }

  return BaseCrudController;
}
