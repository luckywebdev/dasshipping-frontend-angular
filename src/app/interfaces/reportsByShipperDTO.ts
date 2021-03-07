export interface ReportsByShipperDTO {
  shipper_id: number;
  shipper_fullName: string;
  shipper_companyName: string;
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  totalPastDue: number;
}
