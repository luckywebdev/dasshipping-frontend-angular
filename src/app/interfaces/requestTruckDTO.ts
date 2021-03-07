export interface RequestTruckDTO {
  accountId: number;
  type: string;
  VINNumber: string;
  year?: number;
  make?: string;
  model?: string;
  fuelPerMile?: string;
}
