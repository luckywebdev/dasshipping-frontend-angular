import { ReportsByUserDTO } from './models';

export interface GetReportsByUserResponse {
  data: ReportsByUserDTO[];
  count: number;
}
