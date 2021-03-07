import { AccountDTO, OrderBaseDTO } from './models';
import { NotificationDTO } from './notificationDTO';

export interface QuoteDTO extends OrderBaseDTO {
  orderId?: number;
  customer: AccountDTO;
  customerId: number;
  available: Date;
  notes: string;
  external: boolean;
  sentCount: number;
  notifications?: NotificationDTO[],
}
