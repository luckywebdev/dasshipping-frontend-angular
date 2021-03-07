import { AccountDTO, OrderDTO } from './models';

export interface OrderTimelineDTO {
  id: number;
  orderId: number;
  description: string;
  order: OrderDTO;
  createdAt: Date;
  actionAccountId: number;
  actionAccount: AccountDTO;
}
