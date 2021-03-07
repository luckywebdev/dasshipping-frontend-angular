import { AccountDTO } from './models';

export interface TruckDTO {
  id: number;
  account: AccountDTO;
  type: string;
  VINNumber: string;
  year?: number;
  make?: string;
  model?: string;
  capacity?: string;
  createdAt: Date;
  updatedAt: Date;
}
