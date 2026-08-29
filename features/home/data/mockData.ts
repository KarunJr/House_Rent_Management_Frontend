import type { PortfolioSummary, Property, Room } from '../types/models';

export const currentLandlord = {
  name: 'Jirey',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
};

export const properties: Property[] = [
  { id: 'p1', name: 'Greenview Residency', city: 'Kathmandu', totalRooms: 12 },
  { id: 'p2', name: 'Lakeside Villas', city: 'Pokhara', totalRooms: 6 },
  { id: 'p3', name: 'Maple Court', city: 'Kathmandu', totalRooms: 4 },
];

export const rooms: Room[] = [
  {
    id: 'r1',
    label: 'Room 204',
    floorLabel: 'Floor 2',
    propertyId: 'p1',
    propertyName: 'Greenview Residency',
    status: 'occupied',
    monthlyRent: 14000,
    tenant: {
      id: 't1',
      name: 'Anita Rao',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
      leaseStart: '2025-02-01',
      rentAmount: 14000,
      paymentStatus: 'paid',
      rentDueDate: '2026-09-05',
    },
  },
  {
    id: 'r2',
    label: 'Room 101',
    floorLabel: 'Floor 1',
    propertyId: 'p2',
    propertyName: 'Lakeside Villas',
    status: 'vacant',
    monthlyRent: 11500,
  },
  {
    id: 'r3',
    label: 'Room 305',
    floorLabel: 'Floor 3',
    propertyId: 'p1',
    propertyName: 'Greenview Residency',
    status: 'occupied',
    monthlyRent: 15500,
    tenant: {
      id: 't3',
      name: 'Bikash Thapa',
      avatarUrl: 'https://i.pravatar.cc/150?img=51',
      leaseStart: '2024-11-15',
      rentAmount: 15500,
      paymentStatus: 'overdue',
      rentDueDate: '2026-08-25',
    },
  },
  {
    id: 'r4',
    label: 'Room 12',
    floorLabel: 'Floor 1',
    propertyId: 'p3',
    propertyName: 'Maple Court',
    status: 'occupied',
    monthlyRent: 9800,
    tenant: {
      id: 't4',
      name: 'Sunita Gurung',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
      leaseStart: '2025-06-01',
      rentAmount: 9800,
      paymentStatus: 'pending',
      rentDueDate: '2026-09-02',
    },
  },
  {
    id: 'r5',
    label: 'Room 4B',
    floorLabel: 'Floor 4',
    propertyId: 'p2',
    propertyName: 'Lakeside Villas',
    status: 'vacant',
    monthlyRent: 12200,
  },
  {
    id: 'r6',
    label: 'Room 201',
    floorLabel: 'Floor 2',
    propertyId: 'p1',
    propertyName: 'Greenview Residency',
    status: 'occupied',
    monthlyRent: 13500,
    tenant: {
      id: 't6',
      name: 'Prakash Shrestha',
      avatarUrl: 'https://i.pravatar.cc/150?img=60',
      leaseStart: '2025-01-10',
      rentAmount: 13500,
      paymentStatus: 'paid',
      rentDueDate: '2026-09-05',
    },
  },
];

export function getPortfolioSummary(roomList: Room[]): PortfolioSummary {
  const occupied = roomList.filter((r) => r.status === 'occupied');
  const vacant = roomList.filter((r) => r.status === 'vacant');
  const monthlyRevenue = occupied.reduce((sum, r) => sum + r.monthlyRent, 0);
  const pendingCollections = occupied
    .filter((r) => r.tenant?.paymentStatus !== 'paid')
    .reduce((sum, r) => sum + (r.tenant?.rentAmount ?? 0), 0);

  return {
    totalRooms: roomList.length,
    occupiedRooms: occupied.length,
    vacantRooms: vacant.length,
    monthlyRevenue,
    pendingCollections,
    currency: 'NPR',
  };
}
