export interface TripCreateRequest {
  orderIds: number[];
  name?: string;
  driverId?: number;
  dispatcherId?: number;
}
