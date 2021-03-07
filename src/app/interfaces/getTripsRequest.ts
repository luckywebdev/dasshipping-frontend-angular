import { GetList } from './getList';

export interface GetTripsRequest extends GetList {
  id?: number;
  driverId?: number;
  dispatcherId?: number;
  status?: string;
}
