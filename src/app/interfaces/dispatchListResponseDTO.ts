import { DispatchDTO, ResponseListDTO } from './models';

export interface DispatchListResponseDTO extends ResponseListDTO {
  data: DispatchDTO[];
}
