import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ListResponseDto } from 'src/common/base/base.dto';
import { BasePagingFilter } from '../../common/base/base.dto';
import { UserProvider } from './user.enum';

export class UserEntity {
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'string' })
  name: string;

  @IsEmail()
  @ApiProperty({ type: 'string', example: 'string' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'string' })
  avatar: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'string' })
  description: string;

  @IsEnum(UserProvider)
  @ApiProperty({ type: 'string', example: UserProvider.LOCAL })
  provider: UserProvider;
}

export class CreateUserPayloadDto extends PickType(UserEntity, [
  'name',
  'email',
  'password',
  'provider',
]) {}

export class UpdateUserPayloadDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'string' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'email@gmail.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'string' })
  avatar: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: UserEntity })
  data: UserEntity;
}

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;
}

export class FilterUserDto extends BasePagingFilter {
  @IsBoolean()
  @Transform(({ value }) => [true, 'true'].indexOf(value) >= -1)
  @IsOptional()
  is_moderator?: boolean;

  @IsUUID(4)
  @IsOptional()
  owner_id?: string;
}

export class UserListResponse extends ListResponseDto(UserResponseDto) {}
