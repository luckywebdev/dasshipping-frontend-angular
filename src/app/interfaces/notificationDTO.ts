import { AccountDTO } from './accountDTO';
import { OrderDTO } from './models';

export interface NotificationDTO {
  id: number;
  type: string;
  actions?: string[];
  title?: string;
  content?: string;
  status: string;
  additionalInfo?: string;
  order?: OrderDTO;
  orderId?: number;
  targetUserId: number;
  targetUser?: AccountDTO;
  createdAt: Date;
  viewedAt: Date;
}
