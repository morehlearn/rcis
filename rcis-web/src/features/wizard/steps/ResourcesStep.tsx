import TabGroup from '../TabGroup';
import OfficesStep from './OfficesStep';
import AssetsStep from './AssetsStep';
import EquipmentStep from './EquipmentStep';
import type { Office, Asset, Equipment } from '../wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

interface DocumentProps {
  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

interface ResourcesStepProps extends DocumentProps {
  activeTab: number;
  onActiveTabChange: (index: number) => void;

  offices: Office[];
  onAddOffice: (office: Omit<Office, 'id'>) => Promise<boolean>;
  onUpdateOffice: (id: string, office: Omit<Office, 'id'>) => Promise<boolean>;
  onDeleteOffice: (id: string) => Promise<boolean>;
  officesError?: string;
  officesSaving?: boolean;
  officesLoading?: boolean;

  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => Promise<boolean>;
  onUpdateAsset: (id: string, asset: Omit<Asset, 'id'>) => Promise<boolean>;
  onDeleteAsset: (id: string) => Promise<boolean>;
  assetsError?: string;
  assetsSaving?: boolean;
  assetsLoading?: boolean;

  equipment: Equipment[];
  onAddEquipment: (item: Omit<Equipment, 'id'>) => Promise<boolean>;
  onUpdateEquipment: (id: string, item: Omit<Equipment, 'id'>) => Promise<boolean>;
  onDeleteEquipment: (id: string) => Promise<boolean>;
  equipmentError?: string;
  equipmentSaving?: boolean;
  equipmentLoading?: boolean;
}

// Offices, Fixed Assets and Equipment & Plant grouped under tabs - same
// repeatable-list-plus-documents shape as People, just a different trio.
export default function ResourcesStep({
  activeTab, onActiveTabChange,
  offices, onAddOffice, onUpdateOffice, onDeleteOffice, officesError, officesSaving, officesLoading,
  assets, onAddAsset, onUpdateAsset, onDeleteAsset, assetsError, assetsSaving, assetsLoading,
  equipment, onAddEquipment, onUpdateEquipment, onDeleteEquipment, equipmentError, equipmentSaving, equipmentLoading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: ResourcesStepProps) {
  const documentProps: DocumentProps = {
    documents, documentsLoading, documentsUploading, documentsError,
    onUploadDocument, onViewDocument, onDeleteDocument,
  };

  return (
    <TabGroup
      activeIndex={activeTab}
      onActiveIndexChange={onActiveTabChange}
      tabs={[
        {
          key: 'offices',
          label: 'Offices',
          complete: offices.length > 0,
          content: (
            <OfficesStep
              offices={offices}
              onAdd={onAddOffice}
              onUpdate={onUpdateOffice}
              onDelete={onDeleteOffice}
              error={officesError}
              saving={officesSaving}
              loading={officesLoading}
              {...documentProps}
            />
          ),
        },
        {
          key: 'assets',
          label: 'Fixed assets',
          complete: assets.length > 0,
          content: (
            <AssetsStep
              assets={assets}
              onAdd={onAddAsset}
              onUpdate={onUpdateAsset}
              onDelete={onDeleteAsset}
              error={assetsError}
              saving={assetsSaving}
              loading={assetsLoading}
              {...documentProps}
            />
          ),
        },
        {
          key: 'equipment',
          label: 'Equipment & plant',
          complete: equipment.length > 0,
          content: (
            <EquipmentStep
              equipment={equipment}
              onAdd={onAddEquipment}
              onUpdate={onUpdateEquipment}
              onDelete={onDeleteEquipment}
              error={equipmentError}
              saving={equipmentSaving}
              loading={equipmentLoading}
              {...documentProps}
            />
          ),
        },
      ]}
    />
  );
}
