import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './auth.dto';
import {
  comparePassword,
  generateJwtToken,
  hashingPassword,
} from './auth.helper';
import { UserProvider } from '../user/user.enum';
import { UserModel } from 'src/models';
import { EmailService } from '../email/email.service';
import { ConfigServiceKeys } from '../../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @Inject(UserService) private userService: UserService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<string> {
    try {
      const existedUser = await this.userService.getRawByCondition({
        email,
        paranoid: true,
      });

      if (!existedUser) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await comparePassword(
        password,
        existedUser.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const token = generateJwtToken({
        id: existedUser.id,
        email: existedUser.email,
      });

      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signUp({
    email,
    name,
    password,
  }: SignUpDto): Promise<{ token: string; data: UserModel }> {
    try {
      const hashedPassword = await hashingPassword(password);

      const newUser = await this.userService.create({
        email,
        name,
        password: hashedPassword,
        provider: UserProvider.LOCAL,
      });

      const token = await generateJwtToken({
        id: newUser.id,
        email: newUser.email,
      });

      return { token, data: newUser };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;
    const user = await this.userService.findOne(
      { email },
      { throw_error_not_found: true },
    );
    const token = await generateJwtToken(
      {
        id: user.id,
      },
      '3 hours',
    );
    const domain = this.configService.get<string>(
      ConfigServiceKeys.CLIENT_DOMAIN,
    );
    await this.userService.update(user.id, { reset_password_token: token });
    const resetPasswordLink = `${domain}/reset-password?token=${token}`;
    this.emailService.sendEmail({
      subject: 'Reset password',
      html: `<p>Click the link to reset your password: ${resetPasswordLink}</p>`,
      to: email,
    });
    return;
  }

  async resetPassword(
    payload: ResetPasswordDto,
    resetPasswordToken: string,
    userId: string,
  ) {
    const { new_password } = payload;
    const user = await this.userService.getRawByCondition({ id: userId });
    if (
      !user.reset_password_token ||
      user.reset_password_token !== resetPasswordToken
    ) {
      throw new UnauthorizedException('Unauthorized');
    }
    const hashedPassword = await hashingPassword(new_password);
    await this.userService.update(user.id, {
      password: hashedPassword,
      reset_password_token: null,
    });
  }
}
