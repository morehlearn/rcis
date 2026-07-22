import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFirmProfileDto } from './dto/create-firm-profile.dto';
import { UpdateFirmRegistrationDto } from './dto/update-firm-registration.dto';
import { UpdateDeclarationsDto } from './dto/update-declarations.dto';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { MinioService } from '../files/minio.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { UpdateFirmProfileDto } from './dto/update-firm-profile.dto';
import { CreateRefereeDto } from './dto/create-referee.dto';
import { UpdateRefereeDto } from './dto/update-referee.dto';

@Injectable()
export class ContractorApplicationsService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService,
  ) {}

  private async generateRegno(): Promise<string> {
    const year = new Date().getFullYear();
    const counter = await this.prisma.client.regnoCounter.upsert({
      where: { year },
      update: { count: { increment: 1 } },
      create: { year, count: 1 },
    });
    return `NCA/${year}/C${counter.count}`;
  }

  private async getOwned(regno: string, userId: string) {
    const application = await this.prisma.client.contractorCompany.findUnique({ where: { regno } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.userId !== userId) throw new ForbiddenException('This application does not belong to you');
    return application;
  }

  async createFirmProfile(userId: string, dto: CreateFirmProfileDto) {
    const regno = await this.generateRegno();
    return this.prisma.client.contractorCompany.create({
      data: { regno, userId, ...dto },
    });
  }

  async updateFirmRegistration(userId: string, dto: UpdateFirmRegistrationDto) {
    const { regno, ...rest } = dto;
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorCompany.update({
      where: { regno },
      data: rest,
    });
  }

  async updateDeclarations(userId: string, dto: UpdateDeclarationsDto) {
    const { regno, ...rest } = dto;
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorCompany.update({
      where: { regno },
      data: rest,
    });
  }

  async findMyApplications(userId: string) {
    return this.prisma.client.contractorCompany.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listDirectors(userId: string, regno: string) {
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorDirector.findMany({
      where: { regno },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createDirector(userId: string, dto: CreateDirectorDto) {
    const { regno, ...rest } = dto;
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorDirector.create({
      data: { regno, ...rest },
    });
  }

  private async getOwnedDirector(directorId: string, userId: string) {
    const director = await this.prisma.client.contractorDirector.findUnique({
      where: { id: directorId },
      include: { company: true },
    });
    if (!director) throw new NotFoundException('Director not found');
    if (director.company.userId !== userId) throw new ForbiddenException('This director does not belong to you');
    return director;
  }

  async updateDirector(userId: string, directorId: string, dto: UpdateDirectorDto) {
    await this.getOwnedDirector(directorId, userId);
    return this.prisma.client.contractorDirector.update({
      where: { id: directorId },
      data: dto,
    });
  }

  async deleteDirector(userId: string, directorId: string) {
    await this.getOwnedDirector(directorId, userId);
    await this.prisma.client.contractorDirector.delete({ where: { id: directorId } });
    return { success: true };
  }

  async uploadDirectorFile(
    userId: string,
    directorId: string,
    field: 'cv' | 'academicCert',
    file: Express.Multer.File,
  ) {
    await this.getOwnedDirector(directorId, userId);
    const key = await this.minio.uploadFile(file.buffer, file.originalname, file.mimetype);

    const data = field === 'cv'
      ? { cvFileName: file.originalname, cvFileKey: key }
      : { academicCertFileName: file.originalname, academicCertFileKey: key };

    return this.prisma.client.contractorDirector.update({
      where: { id: directorId },
      data,
    });
  }

  async getDirectorFileUrl(userId: string, directorId: string, field: 'cv' | 'academicCert') {
    const director = await this.getOwnedDirector(directorId, userId);
    const key = field === 'cv' ? director.cvFileKey : director.academicCertFileKey;
    if (!key) throw new NotFoundException('No file uploaded for this field');
    const url = await this.minio.getPresignedUrl(key);
    return { url };
  }

  async listOffices(userId: string, regno: string) {
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorOffice.findMany({
      where: { regno },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createOffice(userId: string, dto: CreateOfficeDto) {
    const { regno, ...rest } = dto;
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorOffice.create({ data: { regno, ...rest } });
  }

  private async getOwnedOffice(officeId: string, userId: string) {
    const office = await this.prisma.client.contractorOffice.findUnique({
      where: { id: officeId },
      include: { company: true },
    });
    if (!office) throw new NotFoundException('Office not found');
    if (office.company.userId !== userId) throw new ForbiddenException('This office does not belong to you');
    return office;
  }

  async updateOffice(userId: string, officeId: string, dto: UpdateOfficeDto) {
    await this.getOwnedOffice(officeId, userId);
    return this.prisma.client.contractorOffice.update({ where: { id: officeId }, data: dto });
  }

  async deleteOffice(userId: string, officeId: string) {
    await this.getOwnedOffice(officeId, userId);
    await this.prisma.client.contractorOffice.delete({ where: { id: officeId } });
    return { success: true };
  }

  async listDocuments(userId: string, regno: string) {
    await this.getOwned(regno, userId);
    return this.prisma.client.contractorDocument.findMany({
      where: { regno },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async uploadDocument(userId: string, regno: string, docType: string, file: Express.Multer.File) {
    await this.getOwned(regno, userId);
    const key = await this.minio.uploadFile(file.buffer, file.originalname, file.mimetype);
    return this.prisma.client.contractorDocument.create({
      data: { regno, docType, fileName: file.originalname, fileKey: key },
    });
  }

  async getDocumentUrl(userId: string, documentId: string) {
    const doc = await this.prisma.client.contractorDocument.findUnique({
      where: { id: documentId },
      include: { company: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.company.userId !== userId) throw new ForbiddenException('This document does not belong to you');
    const url = await this.minio.getPresignedUrl(doc.fileKey);
    return { url };
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.prisma.client.contractorDocument.findUnique({
      where: { id: documentId },
      include: { company: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.company.userId !== userId) throw new ForbiddenException('This document does not belong to you');
    await this.prisma.client.contractorDocument.delete({ where: { id: documentId } });
    return { success: true };
  }
  async updateFirmProfile(userId: string, dto: UpdateFirmProfileDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorCompany.update({
    where: { regno },
    data: rest,
  });
}

async listReferees(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorReferee.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createReferee(userId: string, dto: CreateRefereeDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorReferee.create({ data: { regno, ...rest } });
}

private async getOwnedReferee(refereeId: string, userId: string) {
  const referee = await this.prisma.client.contractorReferee.findUnique({
    where: { id: refereeId },
    include: { company: true },
  });
  if (!referee) throw new NotFoundException('Referee not found');
  if (referee.company.userId !== userId) throw new ForbiddenException('This referee does not belong to you');
  return referee;
}

async updateReferee(userId: string, refereeId: string, dto: UpdateRefereeDto) {
  await this.getOwnedReferee(refereeId, userId);
  return this.prisma.client.contractorReferee.update({ where: { id: refereeId }, data: dto });
}

async deleteReferee(userId: string, refereeId: string) {
  await this.getOwnedReferee(refereeId, userId);
  await this.prisma.client.contractorReferee.delete({ where: { id: refereeId } });
  return { success: true };
}


}