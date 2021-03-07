import { ORDER_STATUS } from '../enums';

export * from './roles.constant';
export * from './states.constant';
export * from './stateAndCities.constant';
export * from './status.constant';
export * from './addressType.constant';
export * from './mock.constant';
export * from './gender.constant';
export * from './languages.constant';
export * from './filters.constant';
export * from './tripStatus.constant';
export const REGEX_PHONE = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
export const REGEX_URL = new RegExp('^(https?:\\/\\/)?' +
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
  '((\\d{1,3}\\.){3}\\d{1,3}))' +
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
  '(\\?[;&a-z\\d%_.~+=-]*)?' +
  '(\\#[-a-z\\d_]*)?$', 'i');
export const PATH_ORDERS_TAB = {
  NEW_LOADS: 'new-loads',
  ASSIGNED: 'assigned',
  DECLINED: 'declined',
  PICKED_UP: 'picked-up',
  DELIVERED: 'delivered',
  CLAIMED: 'claimed',
  BILLED: 'billed',
  PAID: 'paid',
  PAST_DUE: 'past-due',
};

export const COMPANY_STATUSES = {
  ACTIVE: 'active',
  REQUESTED: 'requested',
};

export const MESSAGES = {
  'requested-changes': 'Wait for the admin confirmation',
  default: 'Default',
};

export const TABS_ACTIVATED = {
  totalDue: 6,
  totalPaid: 8,
  pastDue: 7,
};

export const MAP_LAYERS = ['http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'];

export const WEB_NOTIFICATION = {
  ORDER: 'order',
  LEAD: 'lead',
  USER: 'user',
  QUOTE: 'quote',
  TRIP: 'trip',
  CARRIER: 'carrier',
  LOADBORD: 'loadbord',
  LOCATION: 'location',
};

export const CLIENT_PAYMENT_STATUSES = {
  NONE: 'none',
  SERVICE_FEE_FAILED: 'service_fee_failed',
  SERVICE_FEE_PAID: 'service_fee_paid',
  CAR_PICKUP_FAILED: 'car_pickup_failed',
  CAR_PICKUP_PAID: 'car_pickup_paid',
};

export const INVITE_STATUS = {
  PENDING: 1,
  ACCEPTED: 2,
  DECLINED: 3,
  EXPIRED: 4,
}

export const SEND_BOL_STATUSES = [
  ORDER_STATUS.PICKED_UP.toString(),
  ORDER_STATUS.ON_DELIVERY.toString(),
  ORDER_STATUS.ON_WAY_TO_DELIVERY.toString(),
  ORDER_STATUS.DELIVERED.toString(),
  ORDER_STATUS.CLAIMED.toString(),
  ORDER_STATUS.BILLED.toString()
];
