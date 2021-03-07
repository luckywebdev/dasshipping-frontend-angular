import { GetList } from './getList';

export interface ReportsByShipperRequestDTO extends GetList {
  fromDeliveryDate?: string;
  toDeliveryDate?: string;
  searchText?: string;
}
