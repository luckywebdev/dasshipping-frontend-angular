import { AccountDTO } from './models';

export interface TrailerDTO {
  id: number;
  account: AccountDTO;
  type: string;
  VINNumber: string;
  year?: number;
  make?: string;
  model?: string;
  fuelPerMile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
