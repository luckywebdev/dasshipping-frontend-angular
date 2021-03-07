import { OrderAttachmentTypeDTO, OrderDTO } from './models';

export interface OrderAttachmentDTO {
  id: number;
  url: string;
  typeId: string;
  type: OrderAttachmentTypeDTO;
  orderId: number;
  order: OrderDTO;
}
