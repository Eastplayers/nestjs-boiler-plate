import * as ClassTransformer from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { HttpStatus, Type } from '@nestjs/common';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger';

export class AppException extends Error {
  // @ApiHideProperty()
  @ApiProperty({
    description: 'mã trạng thái',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
    nullable: true,
    default: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode?: number;

  @ApiProperty({ description: 'mã lỗi', example: 'exception' })
  code: string;

  @ApiProperty({ description: 'thông báo lỗi' })
  message: string;

  @ApiProperty({ description: 'error data', nullable: true })
  data?: any;

  constructor(message: string, code?: string, statusCode?: number, data?: any) {
    super(message);
    this.code = code ?? 'exception';
    this.name = this.code;
    this.statusCode = statusCode ?? 500;
    this.data = data;
  }
}

export class ErrorResponse extends OmitType(AppException, [
  'name',
  'statusCode',
] as const) {}

export function ResponseType<T extends Type>(ClassDef: T) {
  class ResponseItemDto extends ClassDef {
    @ApiProperty({ type: 'string', format: 'uuid' })
    id: string;

    @ApiProperty({ description: 'created time' })
    created_at: Date;

    @ApiProperty({ description: 'updated time' })
    updated_at: Date;

    @ApiProperty({ description: 'deleted time', nullable: true })
    deleted_at?: Date;
  }

  return ResponseItemDto;
}

export class PagingFilterDto {
  @ClassTransformer.Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'number of skipped records',
    default: 0,
    minimum: 0,
  })
  offset?: number;

  @ClassTransformer.Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  @ApiProperty({
    description: 'number of taken records',
    default: 10,
    minimum: 1,
    maximum: 1000,
  })
  limit?: number;
}

export class BasePagingFilter extends PagingFilterDto {
  @IsEnum(['created_at', 'updated_at'])
  @IsOptional()
  @ApiPropertyOptional({
    description: 'sort column',
    enum: ['created_at', 'updated_at'],
    default: 'created_at',
  })
  sort_by?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  @ApiPropertyOptional({
    description: 'sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  sort_order?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'search keyword', nullable: true })
  search?: string;
}

export class SuccessResponseDto {
  @ApiProperty({ description: 'is request success?', example: true })
  success: boolean;

  constructor() {
    this.success = true;
  }
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'is request success?', example: false })
  success: boolean;

  @ApiProperty({ description: 'error information' })
  error: ErrorResponse;

  constructor(error: AppException) {
    this.success = false;
    this.error = { code: error.code, message: error.message, data: error.data };
  }
}

export function ListResponseDto<T extends Type>(ClassDef: T) {
  class ListResponseDto extends SuccessResponseDto {
    @ApiProperty({ description: 'total record', example: 10 })
    total: number;

    @ApiProperty({
      type: ClassDef,
      isArray: true,
      description: 'record list',
    })
    data: T[];
  }

  return ListResponseDto;
}

export function DetailResponseDto<T extends Type>(ClassDef: T) {
  class DetailResponseDto extends SuccessResponseDto {
    @ApiProperty({ description: 'is succeeded?', example: false })
    success: boolean;

    @ApiProperty({ type: ClassDef, description: 'response data' })
    data: T;
  }

  return DetailResponseDto;
}

export interface DateFilter {
  from?: string;
  to?: string;
}

export class BaseEntry {
  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  id: string;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  created_at: Date;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  updated_at: Date;

  @ApiProperty({ type: 'uuid', description: 'record id', example: 'string' })
  deleted_at: Date;
}
