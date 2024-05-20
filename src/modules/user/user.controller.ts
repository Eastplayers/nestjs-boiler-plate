import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as express from 'express';
import { Transaction } from 'sequelize';
import { BaseController } from '../../common/base/base.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TransactionParam } from '../../common/interceptors/transaction.interceptor';
import {
  ChangeUserPasswordDto,
  FilterUserDto,
  UpdateUserPayloadDto,
  UserListResponse,
  UserResponseDto,
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/v1/users')
@ApiBearerAuth()
@ApiOkResponse({ type: UserResponseDto })
@UseGuards(AuthGuard)
export class UserController extends BaseController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  @ApiOkResponse({ type: () => UserListResponse })
  async getUserList(
    @Res() response: express.Response,
    @Req() request: express.Request,
    @Query() filter: FilterUserDto,
  ) {
    const { limit, offset, sort_by, sort_order, ...rest } = filter;
    const listRes = await this.userService.findList(rest, {
      limit,
      offset,
      sort_by,
      sort_order,
    });
    return this.successResponse(response, listRes);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get me' })
  @ApiOkResponse({ type: () => UserResponseDto })
  async getMe(
    @Res() response: express.Response,
    @Req() request: express.Request,
  ) {
    const userId = request.user.id;
    const user = await this.userService.findById(userId);
    return this.successResponse(response, user);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @TransactionParam() transaction: Transaction,
    @Body() payload: ChangeUserPasswordDto,
  ) {
    const userId = request.user?.id;
    await this.userService.changePassword(payload, userId, { transaction });
    return this.successResponse(response, {
      message: 'Change password successfully',
    });
  }

  @Put('/me')
  @ApiOperation({ summary: 'Update my profile' })
  async updateUser(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @TransactionParam() transaction: Transaction,
    @Body() payload: UpdateUserPayloadDto,
  ) {
    const userId = request.user?.id;
    const mod = await this.userService.update(userId, payload, { transaction });
    return this.successResponse(response, mod);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteUser(@Res() response: express.Response, @Param('id') id: string) {
    const mod = await this.userService.delete(id);
    return this.successResponse(response, mod);
  }
}
