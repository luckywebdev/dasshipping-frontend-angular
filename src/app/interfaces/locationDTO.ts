export interface LocationDTO {
  id?: number;
  zipCode: string;
  address?: string;
  state: string;
  city: string;
  addressType?: string;
  instructions?: string;
  point?: any;
  createdAt?: Date;
  updatedAt?: Date;
  lat?: string;
  lon?: string;
}

export interface LayerDTO extends LocationDTO {
  circle: any;
  layerId: number;
}
