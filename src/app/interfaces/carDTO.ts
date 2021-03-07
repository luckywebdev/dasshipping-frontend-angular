export interface CarDTO {
  id?: number;
  orderId?: number;
  pricePerMile?: number;
  height?: string;
  length?: string;
  make: string;
  model: string;
  type: string;
  weight?: string;
  year: string;
  vin: string;
  inop?: boolean;
}
