import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmpty,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user name',
    example: 'Felix Dang',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user email',
    example: 'hello@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'abcdef123',
  })
  password: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user email',
    example: 'hello@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'abcdef123',
  })
  password: string;
}

export class ForgotPasswordDto extends PickType(SignInDto, ['email']) {}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    type: 'string',
    description: 'new password',
    example: 'abcdef123',
  })
  new_password: string;
}
