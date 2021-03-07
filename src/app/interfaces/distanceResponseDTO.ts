import { LocationTripDTO } from './models';

export interface DistanceResponseDTO {
  distance: number;
  price: number;
  costPerMile: string;
  locations?: LocationTripDTO[];
}