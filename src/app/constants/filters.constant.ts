export const TRAILER_TYPE = [
  { value: undefined, label: '--' },
  { value: 'Enclosed', label: 'Enclosed' },
  { value: 'Open', label: 'Open' },
];

export const CONDITION = [
  { value: false, label: 'Operable' },
  { value: true, label: 'Inoperable' },
  { value: undefined, label: '--' },
];

export const VEHICLE_TYPE = [
  { label: 'Pick up', value: 'Pick up' },
  { label: 'Semi truck', value: 'Semi truck' },
  { label: '--', value: undefined },
];

export const ORDER_BY = [
  { label: 'Distance', value: 'distance' },
  { label: 'Price', value: 'price' },
  { label: 'Id', value: 'id' },
  { label: 'Pickup date', value: 'pickUpDate' },
  { label: 'Delivery date', value: 'deliveryDate' },
  { label: 'Updated time', value: 'updatedTime' },
  { label: 'Creation time', value: 'creationTime' },
];
