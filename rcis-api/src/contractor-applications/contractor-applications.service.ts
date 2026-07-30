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
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CreateRefereeDto } from './dto/create-referee.dto';
import { UpdateRefereeDto } from './dto/update-referee.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateProjectExperienceDto } from './dto/create-project-experience.dto';
import { UpdateProjectExperienceDto } from './dto/update-project-experience.dto';
import { CreateLitigationDto } from './dto/create-litigation.dto';
import { UpdateLitigationDto } from './dto/update-litigation.dto';
import { UpsertClassificationDto } from './dto/upsert-classification.dto';
import { BrsService, type BrsVerificationResult } from '../brs/brs.service';


@Injectable()
export class ContractorApplicationsService {
  constructor(
  private prisma: PrismaService,
  private minio: MinioService,
  private brs: BrsService,
) {}

 async verifyCompanyRegistration(userId: string, registrationNumber: string) {
  const brsResult = await this.brs.verifyCompany(registrationNumber);
  if (!brsResult) {
    return { found: false as const };
  }

  const existing = await this.prisma.client.contractorCompany.findFirst({
    where: { incorporationNo: registrationNumber },
  });

  if (existing && existing.userId !== userId) {
    return { found: true as const, blocked: true as const };
  }

  await this.cacheBrsResult(registrationNumber, brsResult);

  const requiresForeignRegistration = brsResult.foreignShareholdingPercent >= 51;

  return {
    found: true as const,
    blocked: false as const,
    requiresForeignRegistration,
    ...brsResult,
    existingRegno: existing?.regno ?? null,
  };
}

// Writes through to the BRS cache on every successful verify, so director
// details can be matched by ID number later (Directors tab, via
// lookupBrsDirector) without querying BRS again - and so that data
// survives across sessions if the contractor resumes the draft later.
private async cacheBrsResult(registrationNumber: string, result: BrsVerificationResult) {
  const companyRecord = await this.prisma.client.brsCompanyRecord.upsert({
    where: { registrationNumber },
    create: {
      registrationNumber,
      businessName: result.businessName,
      kraPin: result.kraPin,
      registrationDate: result.registrationDate,
      foreignShareholdingPercent: result.foreignShareholdingPercent,
    },
    update: {
      businessName: result.businessName,
      kraPin: result.kraPin,
      registrationDate: result.registrationDate,
      foreignShareholdingPercent: result.foreignShareholdingPercent,
    },
  });

  await Promise.all(
    result.directors.map((director) =>
      this.prisma.client.brsDirectorRecord.upsert({
        where: {
          companyRecordId_idNo: { companyRecordId: companyRecord.id, idNo: director.idNo },
        },
        create: {
          companyRecordId: companyRecord.id,
          idNo: director.idNo,
          fullNames: director.fullNames,
          nationality: director.nationality,
          percentageShare: director.percentageShare,
        },
        update: {
          fullNames: director.fullNames,
          nationality: director.nationality,
          percentageShare: director.percentageShare,
        },
      }),
    ),
  );
}

// Matches a director's ID number against the cached BRS data for the
// company behind this application - used to gate the Directors tab so
// only BRS-verified directors can be added.
async lookupBrsDirector(userId: string, regno: string, idNo: string) {
  const company = await this.getOwned(regno, userId);

  const companyRecord = await this.prisma.client.brsCompanyRecord.findUnique({
    where: { registrationNumber: company.incorporationNo },
  });
  if (!companyRecord) {
    return { found: false as const };
  }

  const director = await this.prisma.client.brsDirectorRecord.findUnique({
    where: { companyRecordId_idNo: { companyRecordId: companyRecord.id, idNo } },
  });
  if (!director) {
    return { found: false as const };
  }

  return {
    found: true as const,
    fullNames: director.fullNames,
    nationality: director.nationality,
    percentageShare: director.percentageShare,
  };
}

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


async listAssets(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorAsset.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createAsset(userId: string, dto: CreateAssetDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorAsset.create({ data: { regno, ...rest } });
}

private async getOwnedAsset(assetId: string, userId: string) {
  const asset = await this.prisma.client.contractorAsset.findUnique({
    where: { id: assetId },
    include: { company: true },
  });
  if (!asset) throw new NotFoundException('Asset not found');
  if (asset.company.userId !== userId) throw new ForbiddenException('This asset does not belong to you');
  return asset;
}

async updateAsset(userId: string, assetId: string, dto: UpdateAssetDto) {
  await this.getOwnedAsset(assetId, userId);
  return this.prisma.client.contractorAsset.update({ where: { id: assetId }, data: dto });
}

async deleteAsset(userId: string, assetId: string) {
  await this.getOwnedAsset(assetId, userId);
  await this.prisma.client.contractorAsset.delete({ where: { id: assetId } });
  return { success: true };
}

async listStaff(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorStaff.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createStaff(userId: string, dto: CreateStaffDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorStaff.create({ data: { regno, ...rest } });
}

private async getOwnedStaff(staffId: string, userId: string) {
  const staff = await this.prisma.client.contractorStaff.findUnique({
    where: { id: staffId },
    include: { company: true },
  });
  if (!staff) throw new NotFoundException('Staff member not found');
  if (staff.company.userId !== userId) throw new ForbiddenException('This staff member does not belong to you');
  return staff;
}

async updateStaff(userId: string, staffId: string, dto: UpdateStaffDto) {
  await this.getOwnedStaff(staffId, userId);
  return this.prisma.client.contractorStaff.update({ where: { id: staffId }, data: dto });
}

async deleteStaff(userId: string, staffId: string) {
  await this.getOwnedStaff(staffId, userId);
  await this.prisma.client.contractorStaff.delete({ where: { id: staffId } });
  return { success: true };
}

async listEquipment(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorEquipment.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createEquipment(userId: string, dto: CreateEquipmentDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorEquipment.create({ data: { regno, ...rest } });
}

private async getOwnedEquipment(equipmentId: string, userId: string) {
  const equipment = await this.prisma.client.contractorEquipment.findUnique({
    where: { id: equipmentId },
    include: { company: true },
  });
  if (!equipment) throw new NotFoundException('Equipment not found');
  if (equipment.company.userId !== userId) throw new ForbiddenException('This equipment does not belong to you');
  return equipment;
}

async updateEquipment(userId: string, equipmentId: string, dto: UpdateEquipmentDto) {
  await this.getOwnedEquipment(equipmentId, userId);
  return this.prisma.client.contractorEquipment.update({ where: { id: equipmentId }, data: dto });
}

async deleteEquipment(userId: string, equipmentId: string) {
  await this.getOwnedEquipment(equipmentId, userId);
  await this.prisma.client.contractorEquipment.delete({ where: { id: equipmentId } });
  return { success: true };
}

async listProjectExperience(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorProjectExperience.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createProjectExperience(userId: string, dto: CreateProjectExperienceDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorProjectExperience.create({ data: { regno, ...rest } });
}

private async getOwnedProjectExperience(id: string, userId: string) {
  const record = await this.prisma.client.contractorProjectExperience.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!record) throw new NotFoundException('Project experience entry not found');
  if (record.company.userId !== userId) throw new ForbiddenException('This entry does not belong to you');
  return record;
}

async updateProjectExperience(userId: string, id: string, dto: UpdateProjectExperienceDto) {
  await this.getOwnedProjectExperience(id, userId);
  return this.prisma.client.contractorProjectExperience.update({ where: { id }, data: dto });
}

async deleteProjectExperience(userId: string, id: string) {
  await this.getOwnedProjectExperience(id, userId);
  await this.prisma.client.contractorProjectExperience.delete({ where: { id } });
  return { success: true };
}
async listLitigation(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorLitigation.findMany({
    where: { regno },
    orderBy: { createdAt: 'asc' },
  });
}

async createLitigation(userId: string, dto: CreateLitigationDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorLitigation.create({ data: { regno, ...rest } });
}

private async getOwnedLitigation(id: string, userId: string) {
  const record = await this.prisma.client.contractorLitigation.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!record) throw new NotFoundException('Litigation entry not found');
  if (record.company.userId !== userId) throw new ForbiddenException('This entry does not belong to you');
  return record;
}

async updateLitigation(userId: string, id: string, dto: UpdateLitigationDto) {
  await this.getOwnedLitigation(id, userId);
  return this.prisma.client.contractorLitigation.update({ where: { id }, data: dto });
}

async deleteLitigation(userId: string, id: string) {
  await this.getOwnedLitigation(id, userId);
  await this.prisma.client.contractorLitigation.delete({ where: { id } });
  return { success: true };
}

async getClassification(userId: string, regno: string) {
  await this.getOwned(regno, userId);
  return this.prisma.client.contractorClassification.findUnique({ where: { regno } });
}

async upsertClassification(userId: string, dto: UpsertClassificationDto) {
  const { regno, ...rest } = dto;
  await this.getOwned(regno, userId);

  const existing = await this.prisma.client.contractorClassification.findUnique({ where: { regno } });
  if (!existing) {
    return this.prisma.client.contractorClassification.create({ data: { regno, ...rest } });
  }

  // A classification already exists for this regno - this only happens
  // when applying for an additional certificate/licence against an
  // already-registered company, since every other application type always
  // starts from a brand new regno. That flow's form intentionally shows a
  // blank slate (only the class being newly added), so a plain overwrite
  // here would silently erase whatever categories/subclasses the company
  // already holds. Merge instead: union the subclass lists, and keep the
  // existing category values rather than letting the blank form's
  // defaults clobber them.
  const electricalSubClasses = Array.from(
    new Set([...existing.electricalSubClasses, ...rest.electricalSubClasses]),
  );
  const mechanicalSubClasses = Array.from(
    new Set([...existing.mechanicalSubClasses, ...rest.mechanicalSubClasses]),
  );

  return this.prisma.client.contractorClassification.update({
    where: { regno },
    data: {
      applicationType: rest.applicationType,
      buildingWorksCategory: existing.buildingWorksCategory,
      roadWorksCategory: existing.roadWorksCategory,
      waterWorksCategory: existing.waterWorksCategory,
      electricalCategory: existing.electricalCategory,
      mechanicalCategory: existing.mechanicalCategory,
      electricalSubClasses,
      mechanicalSubClasses,
    },
  });
}

async submitApplication(userId: string, regno: string) {
  const application = await this.getOwned(regno, userId);

  const classification = await this.prisma.client.contractorClassification.findUnique({ where: { regno } });

  const lastSegment = regno.split('/').pop() ?? regno;
  const priorCount = await this.prisma.client.contractorApplication.count({ where: { regno } });
  const trackNo = `${lastSegment}_${priorCount + 1}`;

  const classesApplied = classification
    ? [
        `Building Works: ${classification.buildingWorksCategory}`,
        `Road Works: ${classification.roadWorksCategory}`,
        `Water Works: ${classification.waterWorksCategory}`,
        classification.electricalSubClasses.length > 0
          ? `Electrical (${classification.electricalCategory}): ${classification.electricalSubClasses.join(', ')}`
          : null,
        classification.mechanicalSubClasses.length > 0
          ? `Mechanical (${classification.mechanicalCategory}): ${classification.mechanicalSubClasses.join(', ')}`
          : null,
      ].filter(Boolean).join(' | ')
    : '';

  return this.prisma.client.contractorApplication.create({
    data: {
      regno,
      trackNo,
      companyName: application.firmName,
      classesApplied,
      applicationType: classification?.applicationType ?? 'New Application',
      localForeign: application.localForeign,
    },
  });
}

async listMySubmissions(userId: string) {
  return this.prisma.client.contractorApplication.findMany({
    where: { company: { userId } },
    orderBy: { createdAt: 'desc' },
  });
}
async getSubmission(userId: string, id: string) {
  const submission = await this.prisma.client.contractorApplication.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!submission) throw new NotFoundException('Application not found');
  if (submission.company.userId !== userId) throw new ForbiddenException('This application does not belong to you');
  return submission;
}
}