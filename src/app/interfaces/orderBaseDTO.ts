import { AccountDTO, CarDTO, LocationDTO } from './models';

export interface OrderBaseDTO {
  id: number;
  trailerType: string;
  pickLocationId?: number;
  deliveryLocationId?: number;
  pickLocation: LocationDTO;
  deliveryLocation: LocationDTO;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AccountDTO;
  createdById: number;
  discount: number;
  status: string;
  initialPrice: number;
  priceWithDiscount: number;
  cars: CarDTO[];
  distance: number;
  salePrice: number;
  loadPrice: number;
  source: string;
}
