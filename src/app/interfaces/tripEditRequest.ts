export interface TripEditRequest {
  name?: string;
  driverId?: number;
  dispatcherId?: number;
  status?: string;
  orderIds?: number[];
}
