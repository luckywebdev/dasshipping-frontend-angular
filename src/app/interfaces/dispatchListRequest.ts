import { GetList } from './models';

export interface DispatchListRequest extends GetList {
  status?: string;
  orderId?: number;
}
