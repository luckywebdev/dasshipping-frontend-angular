import { OrderAttachmentDTO, OrderDTO, OrderNoteDTO, OrderTimelineDTO } from './models';

export interface DisptachSheetResponse {
  order: OrderDTO;
  notes: OrderNoteDTO[];
  attachments: OrderAttachmentDTO[];
  timelines: OrderTimelineDTO[];
}
