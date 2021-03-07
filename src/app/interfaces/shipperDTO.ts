export interface ShipperDTO {
  id?: number;
  email: string;
  companyName: string;
  fullName: string;
  phone?: string;
  createdAt?: Date;
  state: string;
  city: string;
  zipCode: string;
  address?: string;
  billingEmail?: string;
}
