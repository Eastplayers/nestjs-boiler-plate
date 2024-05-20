import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActionOptions, BaseModuleService } from 'src/common/base/base.service';
import { UserModel } from 'src/models';
import {
  ChangeUserPasswordDto,
  CreateUserPayloadDto,
} from 'src/modules/user/user.dto';
import { comparePassword, hashingPassword } from '../auth/auth.helper';
import { EmailService } from '../email/email.service';
import { UserProvider } from './user.enum';
import { generate } from 'generate-password';

@Injectable()
export class UserService extends BaseModuleService<UserModel> {
  constructor(
    @InjectModel(UserModel)
    protected model: typeof UserModel,
    @Inject(EmailService) private emailService: EmailService,
  ) {
    super(model);
  }

  protected searchColumns: string[] = ['name', 'email'];

  override async create(
    payload: CreateUserPayloadDto,
    options?: ActionOptions,
  ): Promise<UserModel> {
    try {
      let user = await this.findOne({ email: payload.email }, options);

      if (user) {
        throw new BadRequestException('User already exists');
      }

      user = await super.create(
        {
          ...payload,
          provider: payload.provider ? payload.provider : UserProvider.LOCAL,
        },
        options,
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  getRawByCondition(condition: any) {
    const { paranoid, ...rest } = condition;
    return this.model
      .schema(this.schema)
      .findOne({ where: { ...rest }, paranoid: paranoid });
  }

  async changePassword(payload: ChangeUserPasswordDto, id: string, options?) {
    const { old_password, new_password } = payload;
    const user = await this.model.findByPk(id, {
      transaction: options?.transaction,
    });
    if (!user) {
      throw new ForbiddenException('You do not have permission');
    }
    const currentPassword = user.password;
    const isOldPasswordValid = await comparePassword(
      old_password,
      currentPassword,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    const newPassword = await hashingPassword(new_password);
    await this.update(user.id, { password: newPassword }, options);
  }
}
