import { CarDTO } from './carDTO';
import { LocationDTO, VirtualAccountsRequestDTO } from './models';
import { ShipperDTO } from './shipperDTO';

export interface CreateOrderRequest {
  cars: CarDTO[];
  deliveryLocation: LocationDTO;
  pickLocation: LocationDTO;
  sender: VirtualAccountsRequestDTO;
  receiver: VirtualAccountsRequestDTO;
  pickInstructions?: string;
  deliveryInstructions?: string;
  trailerType: string;
  shipper?: ShipperDTO;
}
