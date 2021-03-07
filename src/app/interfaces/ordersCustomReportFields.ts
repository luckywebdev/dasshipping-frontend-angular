import {
  OrdersCustomReportDeliveryFields,
  OrdersCustomReportGeneralFields,
  OrdersCustomReportPaymentFields,
  OrdersCustomReportShipperFields,
} from './models';

export interface OrdersCustomReportFields {
  general?: OrdersCustomReportGeneralFields;
  pickupInfo?: OrdersCustomReportDeliveryFields;
  deliveryInfo?: OrdersCustomReportDeliveryFields;
  shipperInfo?: OrdersCustomReportShipperFields;
  paymentInfo?: OrdersCustomReportPaymentFields;
  emailAddress: string;
}
