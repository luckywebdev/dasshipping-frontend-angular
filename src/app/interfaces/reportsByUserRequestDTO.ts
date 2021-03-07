import { GetList } from './getList';

export interface ReportsByUserRequestDTO extends GetList {
  role?: number;
  deliveredOnly?: boolean;
  fromDeliveryDate?: string;
  toDeliveryDate?: string;
}
