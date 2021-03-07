import { ReportsByShipperDTO } from './models';

export interface GetReportsByShipperResponse {
  count: number;
  data: ReportsByShipperDTO[];
}
