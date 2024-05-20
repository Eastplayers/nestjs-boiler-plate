import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoilerPlateService } from './boiler_plate.service';
import { BoilerPlateController } from './boiler_plate.controller';
import { BoilerPlateModel } from '../../models';

@Module({
  imports: [SequelizeModule.forFeature([BoilerPlateModel])],
  providers: [BoilerPlateService],
  controllers: [BoilerPlateController],
  exports: [BoilerPlateService],
})
export class BoilerPlateModule {}
