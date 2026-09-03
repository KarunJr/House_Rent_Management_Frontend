import type {
  BillInvoice,
  Floor,
  Lease,
  Owner,
  Payment,
  Room,
  RoomWithDetails,
  Tenant,
} from '@/features/home/home.types';

export const owner: Owner = {
  id: 1,
  name: 'Karun Ghimire',
  email: 'karun@example.com',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-08-30T00:00:00Z',
};

export const floors: Floor[] = [
  {
    id: 1,
    owner_id: 1,
    floor_number: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    owner_id: 1,
    floor_number: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    owner_id: 1,
    floor_number: 3,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const tenants: Tenant[] = [
  {
    id: 1,
    name: 'Ram Sharma',
    phone: '9841234567',
    email: 'ram@example.com',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Sita Gurung',
    phone: '9851234567',
    email: null,
    created_at: '2025-03-15T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Aashish Thapa',
    phone: '9861234567',
    email: 'aashish@example.com',
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Pratiksha Rai',
    phone: '9871234567',
    email: null,
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Kamala Ghimire',
    phone: '9841234567',
    email: null,
    created_at: '2024-11-06T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
];

export const rooms: Room[] = [
  {
    id: 1,
    floor_id: 1,
    room_name: '101',
    base_rent_amount: 18000,
    status: 'OCCUPIED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    floor_id: 1,
    room_name: '102',
    base_rent_amount: 18000,
    status: 'OCCUPIED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    floor_id: 1,
    room_name: '103',
    base_rent_amount: 16000,
    status: 'AVAILABLE',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 4,
    floor_id: 2,
    room_name: '201',
    base_rent_amount: 20000,
    status: 'OCCUPIED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 5,
    floor_id: 2,
    room_name: '202',
    base_rent_amount: 20000,
    status: 'OCCUPIED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 6,
    floor_id: 3,
    room_name: '301',
    base_rent_amount: 22000,
    status: 'OCCUPIED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 7,
    floor_id: 3,
    room_name: '302',
    base_rent_amount: 22000,
    status: 'AVAILABLE',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 8,
    floor_id: 3,
    room_name: '302',
    base_rent_amount: 22000,
    status: 'MAINTENANCE',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const leases: Lease[] = [
  {
    id: 1,
    room_id: 1,
    tenant_id: 1,
    monthly_rent: 18000,
    start_date: '2024-01-01',
    end_date: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    room_id: 2,
    tenant_id: 2,
    monthly_rent: 18000,
    start_date: '2025-03-01',
    end_date: null,
    is_active: true,
    created_at: '2025-03-01T00:00:00Z',
  },
  {
    id: 3,
    room_id: 4,
    tenant_id: 3,
    monthly_rent: 20000,
    start_date: '2023-09-01',
    end_date: null,
    is_active: true,
    created_at: '2023-09-01T00:00:00Z',
  },
  {
    id: 4,
    room_id: 5,
    tenant_id: 4,
    monthly_rent: 20000,
    start_date: '2024-11-01',
    end_date: null,
    is_active: true,
    created_at: '2024-11-01T00:00:00Z',
  },
];

export const invoices: BillInvoice[] = [
  {
    id: 10,
    lease_id: 1,
    billing_month: '2026-06-01',
    rent_amount: 18000,
    total_amount: 18000,
    status: 'PAID',
    due_date: '2026-06-10',
    paid_at: '2026-06-03T09:15:00Z',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 11,
    lease_id: 1,
    billing_month: '2026-07-01',
    rent_amount: 18000,
    total_amount: 18000,
    status: 'PAID',
    due_date: '2026-07-10',
    paid_at: '2026-07-01T11:10:00Z',
    created_at: '2026-07-01T00:00:00Z',
  },
  {
    id: 1,
    lease_id: 1,
    billing_month: '2026-08-01',
    rent_amount: 18000,
    total_amount: 19500,
    status: 'PAID',
    due_date: '2026-08-10',
    paid_at: '2026-08-03T10:30:00Z',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 2,
    lease_id: 2,
    billing_month: '2026-08-01',
    rent_amount: 18000,
    total_amount: 18500,
    status: 'PENDING',
    due_date: '2026-08-10',
    paid_at: null,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 3,
    lease_id: 3,
    billing_month: '2026-08-01',
    rent_amount: 20000,
    total_amount: 22000,
    status: 'OVERDUE',
    due_date: '2026-08-10',
    paid_at: null,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 4,
    lease_id: 4,
    billing_month: '2026-08-01',
    rent_amount: 20000,
    total_amount: 20000,
    status: 'PAID',
    due_date: '2026-08-10',
    paid_at: '2026-08-02T09:00:00Z',
    created_at: '2026-08-01T00:00:00Z',
  },
];

export const payments: Payment[] = [
  {
    id: 10,
    invoice_id: 10,
    amount: 18000,
    payment_method: 'BANK_TRANSFER',
    paid_at: '2026-06-03T09:15:00Z',
  },
  {
    id: 11,
    invoice_id: 11,
    amount: 18000,
    payment_method: 'CASH',
    paid_at: '2026-07-01T11:10:00Z',
  },
  {
    id: 1,
    invoice_id: 1,
    amount: 19500,
    payment_method: 'BANK_TRANSFER',
    paid_at: '2026-08-03T10:30:00Z',
  },
  {
    id: 2,
    invoice_id: 4,
    amount: 20000,
    payment_method: 'CASH',
    paid_at: '2026-08-02T09:00:00Z',
  },
];

export const roomsWithDetails: RoomWithDetails[] = rooms.map((room) => {
  const floor = floors.find((f) => f.id === room.floor_id)!;

  const lease = leases.find((l) => l.room_id === room.id && l.is_active) ?? null;

  const tenant = lease ? (tenants.find((t) => t.id === lease.tenant_id) ?? null) : null;

  const currentInvoice = lease
    ? (invoices.find(
        (invoice) => invoice.lease_id === lease.id && invoice.billing_month === '2026-08-01',
      ) ?? null)
    : null;

  return {
    ...room,
    floor,
    active_lease: lease,
    tenant,
    current_invoice: currentInvoice,
  };
});

export const stats = {
  totalRooms: rooms.length,

  occupied: rooms.filter((room) => room.status === 'OCCUPIED').length,

  vacant: rooms.filter((room) => room.status === 'AVAILABLE').length,

  maintenance: rooms.filter((room) => room.status === 'MAINTENANCE').length,

  pendingPayments: invoices.filter(
    (invoice) =>
      invoice.status === 'PENDING' || invoice.status === 'OVERDUE' || invoice.status === 'PARTIAL',
  ).length,

  monthlyRevenue: payments
    .filter((payment) => payment.paid_at.startsWith('2026-08'))
    .reduce((sum, payment) => sum + payment.amount, 0),
};
