import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), EmailModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})

export class UserModule {}
