import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Models from 'src/models';
import { ConfigServiceKeys } from '../../common/constants';

export const logYellow = (message: string) => `\x1b[33m${message}\x1b[0m`;
export const logRed = (message: string) => `\x1b[91m${message}\x1b[0m`;

// const changeColors = (query: string, texts: string[], color = logYellow) => {
//   let result = query;
//   texts.forEach((text) => {
//     result = result.replace(new RegExp(text, 'g'), color(text));
//   });
//   return result;
// };
// const logging = (sql: string) => {
//   let query = sql.replace('WHERE', '\n\tWHERE');
//   query = query.replace('FROM', '\n\tFROM');
//   query = query.replace('JOIN', '\n\tJOIN');
//   query = query.replace('ORDER', '\n\tORDER');

//   query = changeColors(query, [
//     'SELECT',
//     'OR ',
//     'WHERE',
//     'FROM',
//     'JOIN',
//     'UPDATE',
//   ]);
//   query = changeColors(query, ['ORDER BY', 'ON', 'AND']);
//   query = changeColors(query, ['LEFT', 'RIGHT', 'INNER']);
//   query = changeColors(query, ['Executed'], logRed);
//   console.log(logRed('*'.repeat(7)), query);
// };

const sequelizeModule = SequelizeModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    dialect: 'postgres',
    host: configService.get(ConfigServiceKeys.DB_HOST),
    port: +configService.get(ConfigServiceKeys.DB_PORT),
    username: configService.get(ConfigServiceKeys.DB_USERNAME),
    password: configService.get(ConfigServiceKeys.DB_PASSWORD),
    database: configService.get(ConfigServiceKeys.DB_NAME),
    models: Object.values(Models),
    // synchronize: true,
    // autoLoadModels: true,
    timezone: configService.get(ConfigServiceKeys.TIMEZONE) || 'UTC',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 60000,
    },
  }),
});

@Module({
  imports: [sequelizeModule],
})
export class DatabaseModule {}
