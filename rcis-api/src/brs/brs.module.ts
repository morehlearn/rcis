import { Global, Module } from '@nestjs/common';
import { BrsService } from './brs.service';

@Global()
@Module({
  providers: [BrsService],
  exports: [BrsService],
})
export class BrsModule {}