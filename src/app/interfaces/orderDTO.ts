import { AccountDTO } from './accountDTO';
import { InspectionDTO } from './inspectionDTO';
import { InviteDTO } from './inviteDTO';
import {
  CompanyDTO,
  DispatchDTO,
  NotificationDTO,
  OrderAttachmentDTO,
  OrderBaseDTO,
  OrderNoteDTO,
  ShipperDTO,
} from './models';
import { OrderToTripDTO } from './orderToTripDTO';

export interface OrderDTO extends OrderBaseDTO {
  company: CompanyDTO;
  companyId: number;
  isVirtual: boolean;
  orderTrips: OrderToTripDTO[];
  driver: AccountDTO;
  driverId: number;
  sender: AccountDTO;
  senderId: number;
  receiver: AccountDTO;
  receiverId: number;
  dispatcher: AccountDTO;
  dispatcherId: number;
  notes: OrderNoteDTO[];
  attachments: OrderAttachmentDTO[];
  published: boolean;
  dispatches: DispatchDTO[];
  pickInstructions?: string;
  deliveryInstructions?: string;
  pickDate?: Date;
  deliveryDate?: Date;
  loadPrice: number;
  tripId?: number;
  paymentMethods?: string;
  paymentNote?: string;
  brokerFee?: number;
  shipperId: number;
  shipper: ShipperDTO;
  invoiceDueDate?: Date;
  dispatchInstructions?: string;
  uuid?: string;
  clientPaymentStatus?: string;
  invite?: InviteDTO[];
  notifications?: NotificationDTO[];
  externalId?: string;
  inspections?: InspectionDTO[];
  paymentDelivery: boolean;
  preStatus?: string;
}
