import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/base/base.model';
import { UserProvider } from 'src/modules/user/user.enum';

@Table({
  modelName: 'users',
})
export class UserModel extends BaseModel {
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(UserProvider) }),
  })
  provider: string;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.TEXT,
  })
  reset_password_token: string;

  transformToResponse() {
    const detail = JSON.parse(JSON.stringify(this));
    delete detail.password;
    delete detail.reset_password_token;
    return detail;
  }
}
