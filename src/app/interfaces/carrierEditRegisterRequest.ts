import { CarrierNewRegisterRequest } from './models';

export interface CarrierEditRegisterRequest extends CarrierNewRegisterRequest {
  id: number;
  hash: string;
}
