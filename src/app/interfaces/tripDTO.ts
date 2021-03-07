import { CompanyDTO } from './companyDTO';
import { AccountDTO } from './models';
import { LocationDTO } from './locationDTO';
import { OrderToTripDTO } from './orderToTripDTO';

export interface TripDTO {
  id: number;
  name: string;
  company: CompanyDTO;
  companyId: number;
  createdBy: AccountDTO;
  createdById: number;
  dispatcher: AccountDTO;
  dispatcherId: number;
  driver: AccountDTO;
  driverId: number;
  orderTrips: OrderToTripDTO[];
  status: string;
  pickLocation: LocationDTO;
  pickLocationId: number;
  deliveryLocation: LocationDTO;
  deliveryLocationId: number;
  distance: number;
  totalPrice: number;
  route: string[];
  createdAt: Date;
  updatedAt: Date;
  costPerMile?: number;
}
