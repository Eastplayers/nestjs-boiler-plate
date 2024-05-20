import { Inject } from '@nestjs/common';
import { BaseCrudController } from '../../common/base/base_crud.controller';
import { BoilerPlateService } from './boiler_plate.service';
import {
  BoilerPlateDetailResponse,
  BoilerPlateListResponse,
  CreateBoilerPlateDto,
  FilterBoilerPlateQuey,
  UpdateBoilerPlateDto,
} from './boiler_plate.dto';

const modelName = 'Boiler Plate';
export class BoilerPlateController extends BaseCrudController({
  modelName,
  filterType: FilterBoilerPlateQuey,
  createPayloadType: CreateBoilerPlateDto,
  updatePayloadType: UpdateBoilerPlateDto,
  detailResponseType: BoilerPlateDetailResponse,
  listResponseType: BoilerPlateListResponse,
}) {
  @Inject()
  service: BoilerPlateService;
}
