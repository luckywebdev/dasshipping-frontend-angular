export const ORDER_STATUSES = [
  { label: 'All', value: '' },
  { label: 'Claimed', value: 'claimed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Billed', value: 'billed' },
  { label: 'Published', value: 'published' },
  { label: 'Declined', value: 'declined' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'On Pickup', value: 'on_pickup' },
  { label: 'On Way To Pickup', value: 'on_way_to_pickup' },
  { label: 'On Delivery', value: 'on_delivery' },
  { label: 'On Way To Delivery', value: 'on_way_to_delivery' },
  { label: 'Deleted', value: 'deleted' },
];

export const REQUESTS_STATUSES = {
  decline: {
    value: 'decline',
    label: 'Declined',
  },
  accept: {
    value: 'accept',
    label: 'Accepted',
  },
};
