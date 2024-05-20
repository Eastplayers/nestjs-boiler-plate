import { BaseModuleService } from '../../common/base/base.service';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { BoilerPlateModel } from '../../models';

@Injectable()
export class BoilerPlateService extends BaseModuleService<BoilerPlateModel> {
  constructor(
    @InjectModel(BoilerPlateModel) protected model: typeof BoilerPlateModel,
  ) {
    super(model);
  }
}
