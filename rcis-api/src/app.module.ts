import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContractorApplicationsModule } from './contractor-applications/contractor-applications.module';
import { FilesModule } from './files/files.module';
import { BrsModule } from './brs/brs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContractorApplicationsModule,
    FilesModule,
    BrsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

