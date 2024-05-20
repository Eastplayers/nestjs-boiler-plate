import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './auth.dto';
import { BaseController } from 'src/common/base/base.controller';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('/v1/auth')
@ApiTags('Auth')
export class AuthController extends BaseController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(@Res() response: express.Response, @Body() data: SignInDto) {
    const authRes = await this.authService.signIn(data);
    return this.successResponse(response, authRes);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign Up as Admin' })
  async signUp(@Res() response: express.Response, @Body() data: SignUpDto) {
    const authRes = await this.authService.signUp(data);
    return this.successResponse(response, authRes);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send forgot password email' })
  async forgetPassword(
    @Res() response: express.Response,
    @Body() data: ForgotPasswordDto,
  ) {
    await this.authService.forgotPassword(data);
    return this.successResponse(response, 'An email has been sent to you');
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(
    @Res() response: express.Response,
    @Req() request: express.Request,
    @Body() data: ResetPasswordDto,
  ) {
    const userId = request.user?.id;
    const token = request.headers['authorization']?.split(' ')?.[1];
    await this.authService.resetPassword(data, token, userId);
    return this.successResponse(response, 'Reset password successfully');
  }
}
