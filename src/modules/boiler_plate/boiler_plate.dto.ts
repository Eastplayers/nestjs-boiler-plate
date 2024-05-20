import { OmitType, PartialType } from '@nestjs/swagger';
import {
  BasePagingFilter,
  DetailResponseDto,
  ListResponseDto,
  ResponseType,
} from '../../common/base/base.dto';

export class BoilerPlateEntry {}

export class FilterBoilerPlateQuey extends BasePagingFilter {}

export class CreateBoilerPlateDto extends BoilerPlateEntry {}

export class UpdateBoilerPlateDto extends PartialType(
  OmitType(BoilerPlateEntry, [] as const),
) {}

export class BoilerPlateResponse extends ResponseType(BoilerPlateEntry) {}

export class BoilerPlateDetailResponse extends DetailResponseDto(
  BoilerPlateResponse,
) {}

export class BoilerPlateListResponse extends ListResponseDto(
  BoilerPlateResponse,
) {}
