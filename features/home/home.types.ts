import { BadgeStatus } from './components/ui/StatusBadge';

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export type ChargeType = 'FIXED' | 'METERED';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';

export interface Owner {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Floor {
  id: number;
  owner_id: number;
  floor_number: number;
  created_at: string;
}

export interface Room {
  id: number;
  floor_id: number;
  room_name: string;
  base_rent_amount: number;
  status: RoomStatus;
  created_at: string;
}

export interface Lease {
  id: number;
  room_id: number;
  tenant_id: number;
  monthly_rent: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  owner_id: number;
  name: string;
  charge_type: ChargeType;
  default_rate: number;
}

export interface RoomService {
  id: number;
  room_id: number;
  service_id: number;
  custom_rate: number | null;
}

export interface MeterReading {
  id: number;
  room_id: number;
  service_id: number;
  reading_date: string;
  reading_value: number;
}

export interface BillInvoice {
  id: number;
  lease_id: number;
  billing_month: string;
  rent_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface BillItem {
  id: number;
  invoice_id: number;
  service_id: number | null;
  description: string | null;
  amount: number;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_method: string | null;
  paid_at: string;
}

/**
 * Joined/derived data used by the UI.
 *
 * This isn't a DB table.
 * It represents what your API can return after joining:
 *
 * room
 * → floor
 * → lease
 * → tenant
 * → invoice
 */
export interface RoomWithDetails extends Room {
  floor: Floor;

  active_lease: Lease | null;

  tenant: Tenant | null;

  current_invoice: BillInvoice | null;
}

export const invoiceStatusToBadge = (invoiceStatus: InvoiceStatus): BadgeStatus => {
  switch (invoiceStatus) {
    case 'PENDING':
      return 'pending';
    case 'PAID':
      return 'paid';
    case 'PARTIAL':
      return 'partial';
    case 'OVERDUE':
      return 'overdue';
    case 'CANCELLED':
      return 'cancelled';
  }
};
