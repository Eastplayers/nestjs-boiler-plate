import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { GuardModule } from './common/guards/guard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    GuardModule,
    // IMPORTANT NOTE: DO NOT REMOVE OR EDIT THIS ROW
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
