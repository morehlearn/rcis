import { Module } from '@nestjs/common';
import { ContractorApplicationsService } from './contractor-applications.service';
import { ContractorApplicationsController } from './contractor-applications.controller';

@Module({
  controllers: [ContractorApplicationsController],
  providers: [ContractorApplicationsService],
})
export class ContractorApplicationsModule {}