import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface BrsDirector {
  fullNames: string;
  idNo: string;
  nationality: string;
  percentageShare: string;
}

export interface BrsVerificationResult {
  verified: boolean;
  businessName: string;
  kraPin: string;
  registrationDate: string;
  directors: BrsDirector[];
}
export interface BrsVerificationResult {
  verified: boolean;
  businessName: string;
  kraPin: string;
  registrationDate: string;
  directors: BrsDirector[];
  foreignShareholdingPercent: number;
}

@Injectable()
export class BrsService {
  constructor(private config: ConfigService) {}

  async verifyCompany(registrationNumber: string): Promise<BrsVerificationResult | null> {
    const url = `${this.config.get<string>('BRS_API_URL')}?registration_number=${encodeURIComponent(registrationNumber)}`;

    const res = await fetch(url, {
      headers: { Authorization: this.config.get<string>('BRS_AUTH_HEADER')! },
    });

    if (!res.ok) {
      throw new HttpException('Could not reach BRS verification service', 502);
    }

    const data = await res.json();
    const record = data.records?.[0];
    if (!record || !record.verified) return null;

    const directorShareholders = (record.partners ?? []).filter(
      (p: any) => p.type === 'director_shareholder',
    );

    const totalShares = directorShareholders.reduce(
      (sum: number, p: any) => sum + (p.shares?.[0]?.number_of_shares ?? 0),
      0,
    );

    const directors: BrsDirector[] = directorShareholders.map((p: any) => {
      const shares = p.shares?.[0]?.number_of_shares ?? 0;
      const percentage = totalShares > 0 ? Math.round((shares / totalShares) * 100) : 0;
      return {
        fullNames: p.name,
        idNo: p.id_number,
        nationality: p.id_type === 'citizen' ? 'Kenyan' : 'Other',
        percentageShare: String(percentage),
      };
    });

     const foreignShareholdingPercent = directors
      .filter((d) => d.nationality !== 'Kenyan')
      .reduce((sum, d) => sum + Number(d.percentageShare), 0);

    return {
      verified: true,
      businessName: record.business_name,
      kraPin: record.kra_pin,
      registrationDate: record.registration_date,
      directors,
      foreignShareholdingPercent,
    };
    
  }
}