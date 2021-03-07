import { AccountDTO } from './models';

export interface DriverLocationDTO {
  id: number;
  createdAt: Date;
  lat: number;
  lon: number;
  driver: AccountDTO;
  driverId: number;
}
