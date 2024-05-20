import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [AuthGuard],
})
export class GuardModule {}
