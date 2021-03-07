export interface CalculateTripDTO {
  origin: string;
  destination: string;
  isStartPoint: boolean;
  isEndPoint: boolean;
  isVirtual?: boolean;
  cost: number;
  originPoint?: string;
  destinationPoint?: string;
}