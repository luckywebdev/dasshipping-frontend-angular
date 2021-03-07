import { CalculateTripDTO } from './models';

export interface CalculateTripRequestDTO {
  locations: CalculateTripDTO[];
  optimize: boolean;
}