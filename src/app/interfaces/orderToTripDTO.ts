import { TripDTO } from './tripDTO';
import { OrderDTO } from './orderDTO';

export interface OrderToTripDTO {
  id: number;
  tripId: number;
  orderId: number;
  status: string;
  trip: TripDTO;
  order: OrderDTO;
}