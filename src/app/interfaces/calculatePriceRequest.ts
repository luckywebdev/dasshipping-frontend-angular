import { CarDTO } from './carDTO';
import { LocationDTO } from './models';

export interface CalculatePriceRequest {
  cars?: CarDTO[];
  deliveryLocation: LocationDTO;
  pickLocation: LocationDTO;
  trailerType: string;
  orderId: number;
}
