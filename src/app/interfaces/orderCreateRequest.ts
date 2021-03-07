import { CarDTO } from './carDTO';
import { LocationDTO, ShipperDTO } from './models';

export interface OrderCreateRequest {
  startDate?: string;
  endDate?: string;
  pickLocation?: LocationDTO;
  deliveryLocation?: LocationDTO;
  statusId?: number;
  price?: number;
  tripId?: number;
  cars?: CarDTO[];
  driverId?: number;
  pickContactPersonName?: string;
  pickContactPersonPhone?: string;
  pickContactPersonEmail?: string;
  deliveryContactPersonName?: string;
  deliveryContactPersonPhone?: string;
  deliveryContactPersonEmail?: string;
  paid?: boolean;
  paymentMethods?: string;
  paymentNote?: string;
  brokerFee?: number;
  shipper?: ShipperDTO;
}
