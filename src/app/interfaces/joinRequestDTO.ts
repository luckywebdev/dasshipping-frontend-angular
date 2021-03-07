import { AccountDTO, CompanyDTO } from './models';

export interface JoinRequestDTO {
  id: number;
  company: CompanyDTO;
  account: AccountDTO;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
