export interface GetOrdersRequest {
  isVirtual?: boolean;
  status?: string;
  make?: string;
  model?: string;
  carType?: string;
  trailerType?: string;
  condition?: string;
  orderByField?: string;
  orderByDirection?: string;
  companyId?: number;
  createdById?: number;
  limit?: number;
  offset?: number;
  origin?: string;
  destination?: string;
  minimumNumberOfVehiclesPerLoad?: string;
  makeOrModel?: string;
  grouped?: boolean;
  shipperCompanyName?: string;
}
