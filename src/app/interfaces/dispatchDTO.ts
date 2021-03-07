import { AccountDTO, CompanyDTO, OrderDTO } from './models';

export interface DispatchDTO {
  id: number;
  company: CompanyDTO;
  account: AccountDTO;
  order: OrderDTO;
  orderId?: number;
  companyId?: number;
  accountId?: number;
  status: string;
  pickDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
