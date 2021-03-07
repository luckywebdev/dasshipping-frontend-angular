export interface OrdersCustomReportFilters {
  include?: string;
  assignedTo?: string;
  status?: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  fromDeliveryDate?: string;
  toDeliveryDate?: string;
  orderByDirection?: 'ASC' | 'DESC';
  orderByField?: string;
}
