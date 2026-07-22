import { Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ContractorApplicationsService } from './contractor-applications.service';
import { CreateFirmProfileDto } from './dto/create-firm-profile.dto';
import { UpdateFirmRegistrationDto } from './dto/update-firm-registration.dto';
import { UpdateDeclarationsDto } from './dto/update-declarations.dto';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto,  } from './dto/update-office.dto';
import { UpdateFirmProfileDto,  } from './dto/update-firm-profile.dto';
import { CreateRefereeDto } from './dto/create-referee.dto';
import { UpdateRefereeDto } from './dto/update-referee.dto';
UpdateFirmProfileDto 
@UseGuards(JwtAuthGuard)
@Controller('contractor-applications')
export class ContractorApplicationsController {
  constructor(private service: ContractorApplicationsService) {}

  @Post()
  createFirmProfile(@CurrentUser() user: { userId: string }, @Body() dto: CreateFirmProfileDto) {
    return this.service.createFirmProfile(user.userId, dto);
  }

  @Patch('registration')
  updateFirmRegistration(@CurrentUser() user: { userId: string }, @Body() dto: UpdateFirmRegistrationDto) {
    return this.service.updateFirmRegistration(user.userId, dto);
  }

  @Patch('declarations')
  updateDeclarations(@CurrentUser() user: { userId: string }, @Body() dto: UpdateDeclarationsDto) {
    return this.service.updateDeclarations(user.userId, dto);
  }
  
  @Get()
  findMine(@CurrentUser() user: { userId: string }) {
  return this.service.findMyApplications(user.userId);
}
@Get('directors')
listDirectors(@CurrentUser() user: { userId: string }, @Query('regno') regno: string) {
  return this.service.listDirectors(user.userId, regno);
}

@Post('directors')
createDirector(@CurrentUser() user: { userId: string }, @Body() dto: CreateDirectorDto) {
  return this.service.createDirector(user.userId, dto);
}

@Patch('directors/:id')
updateDirector(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: UpdateDirectorDto) {
  return this.service.updateDirector(user.userId, id, dto);
}

@Delete('directors/:id')
deleteDirector(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.deleteDirector(user.userId, id);
}

@Post('directors/:id/cv')
@UseInterceptors(FileInterceptor('file'))
uploadDirectorCv(
  @CurrentUser() user: { userId: string },
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.service.uploadDirectorFile(user.userId, id, 'cv', file);
}

@Post('directors/:id/academic-certificate')
@UseInterceptors(FileInterceptor('file'))
uploadDirectorAcademicCert(
  @CurrentUser() user: { userId: string },
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.service.uploadDirectorFile(user.userId, id, 'academicCert', file);
}

@Get('directors/:id/cv-url')
getDirectorCvUrl(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.getDirectorFileUrl(user.userId, id, 'cv');
}

@Get('directors/:id/academic-certificate-url')
getDirectorAcademicCertUrl(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.getDirectorFileUrl(user.userId, id, 'academicCert');
}

@Get('offices')
listOffices(@CurrentUser() user: { userId: string }, @Query('regno') regno: string) {
  return this.service.listOffices(user.userId, regno);
}

@Post('offices')
createOffice(@CurrentUser() user: { userId: string }, @Body() dto: CreateOfficeDto) {
  return this.service.createOffice(user.userId, dto);
}

@Patch('offices/:id')
updateOffice(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: UpdateOfficeDto) {
  return this.service.updateOffice(user.userId, id, dto);
}

@Delete('offices/:id')
deleteOffice(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.deleteOffice(user.userId, id);
}

@Get('documents')
listDocuments(@CurrentUser() user: { userId: string }, @Query('regno') regno: string) {
  return this.service.listDocuments(user.userId, regno);
}

@Post('documents')
@UseInterceptors(FileInterceptor('file'))
uploadDocument(
  @CurrentUser() user: { userId: string },
  @Body('regno') regno: string,
  @Body('docType') docType: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.service.uploadDocument(user.userId, regno, docType, file);
}

@Get('documents/:id/url')
getDocumentUrl(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.getDocumentUrl(user.userId, id);
}

@Delete('documents/:id')
deleteDocument(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.deleteDocument(user.userId, id);
}
@Patch('profile')
updateFirmProfile(@CurrentUser() user: { userId: string }, @Body() dto: UpdateFirmProfileDto) {
  return this.service.updateFirmProfile(user.userId, dto);
}

@Get('referees')
listReferees(@CurrentUser() user: { userId: string }, @Query('regno') regno: string) {
  return this.service.listReferees(user.userId, regno);
}

@Post('referees')
createReferee(@CurrentUser() user: { userId: string }, @Body() dto: CreateRefereeDto) {
  return this.service.createReferee(user.userId, dto);
}

@Patch('referees/:id')
updateReferee(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: UpdateRefereeDto) {
  return this.service.updateReferee(user.userId, id, dto);
}

@Delete('referees/:id')
deleteReferee(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
  return this.service.deleteReferee(user.userId, id);
}

}