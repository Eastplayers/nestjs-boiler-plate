import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  addheaders?: any;

  @IsOptional()
  serviceToken?: string;

  @IsOptional()
  query?: any;

  @IsOptional()
  params?: any;
}

export class PostCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsNotEmpty()
  @IsOptional()
  data?: any;

  @IsOptional()
  serviceToken?: string;

  @IsOptional()
  addheaders?: any;
}

export class PutCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  @IsNotEmpty()
  data?: any;

  @IsOptional()
  addheaders?: any;
}

export class DeleteCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  @IsNotEmpty()
  data?: any;
}
