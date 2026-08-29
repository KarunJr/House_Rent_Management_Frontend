export type RoomStatus = 'occupied' | 'vacant';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Tenant {
  id: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  leaseStart: string; // ISO date
  rentAmount: number;
  paymentStatus: PaymentStatus;
  rentDueDate: string; // ISO date
}

export interface Room {
  id: string;
  label: string; // e.g. "Room 204"
  floorLabel: string; // e.g. "Floor 2"
  propertyId: string;
  propertyName: string;
  status: RoomStatus;
  tenant?: Tenant;
  monthlyRent: number; // asking rent, used even when vacant
}

export interface Property {
  id: string;
  name: string;
  city: string;
  totalRooms: number;
}

export interface PortfolioSummary {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  monthlyRevenue: number;
  pendingCollections: number;
  currency: string;
}
