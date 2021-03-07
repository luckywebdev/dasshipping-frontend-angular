import { AccountDTO, OrderDTO } from './models';

export interface OrderNoteDTO {
  id: number;
  orderId: number;
  order: OrderDTO;
  accountId: number;
  account: AccountDTO;
  createdAt: Date;
  note: string;
  eventKey: string;
}
