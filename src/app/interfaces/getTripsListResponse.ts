import { TripDTO } from './tripDTO';

export interface GetTripsListResponse {
  data: TripDTO[];
  count: number;
}
