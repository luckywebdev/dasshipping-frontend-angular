import { ReportsByUserRequestDTO } from './reportsByUserRequestDTO';

export interface DowloadReportsRequestDTO {
  filter?: ReportsByUserRequestDTO;
  email: string;
}
