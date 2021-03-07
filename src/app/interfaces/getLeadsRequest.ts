import {GetList} from './getList';

export interface GetLeadsRequest extends GetList {
  origin?: string;
  destination?: string;
  vehicleType?: string;
  minimumNumberOfVehiclesPerLoad?: string;
  trailerType?: string;
}
