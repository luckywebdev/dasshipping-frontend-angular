import { DamageDTO, InspectionDTO } from './models';

export interface InspectionDetailsDTO {
  id: number;
  face: string;
  sourceSchemeVersion: string;
  sourceSchemeRatio: number;
  damages: DamageDTO[];
  inspection: InspectionDTO;
  inspectionId: number;
}
