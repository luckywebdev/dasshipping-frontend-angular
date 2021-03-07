import { GetList } from './getList';

export interface GetCompanyListRequest extends GetList {
  status?: string;
}
