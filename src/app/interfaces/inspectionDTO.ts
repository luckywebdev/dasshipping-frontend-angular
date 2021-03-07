import { CarDTO } from './carDTO';
import { LocationDTO } from './locationDTO';
import { AccountDTO, InspectionDetailsDTO, InspectionImagesDTO, SignedByDTO } from './models';
import { OrderDTO } from './orderDTO';

export interface InspectionDTO {
  id: number;
  type: string;
  vinNumberConfirmed: boolean;
  driver: AccountDTO;
  driverId: number;
  client: AccountDTO;
  clientId: number;
  createdBy: AccountDTO;
  createdById: number;
  createdLocation: LocationDTO;
  createdLocationId: number;
  signLocation: LocationDTO;
  signLocationId: number;
  car: CarDTO;
  carId: number;
  details: InspectionDetailsDTO[];
  signedBy: SignedByDTO;
  signatureUrl: string;
  signedAt: Date;
  status: string;
  order: OrderDTO;
  orderId: number;
  createdAt: Date;
  updatedAt: Date;
  images: InspectionImagesDTO[];
  driverNotes: string;
}
