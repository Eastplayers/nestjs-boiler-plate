import { Table } from 'sequelize-typescript';
import { BaseModel } from '../common/base/base.model';

@Table({ modelName: 'boiler_plates' })
export class BoilerPlateModel extends BaseModel {}
