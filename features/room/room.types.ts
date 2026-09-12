import { RoomStatus } from '../home/home.types';

export interface RoomDetails {
  id: string;
  roomName: string;
  baseRentAmount: number;
  status: RoomStatus;
  createdAt: string;
}
export interface AddRoomResponse {
  success: boolean;
  message: string;
  roomDetails: RoomDetails | null;
}

export interface RoomCardDetails {
  id: string;
  roomName: string;
  floorId: string;
  baseRentAmount: number;
  status: RoomStatus;
  activeLease: ActiveLease | null;
}

interface ActiveLease {
  id: string;
  monthlyRent: number;
  startDate: string;
  endDate: string | null;
  tenant: {
    id: string;
    name: string;
  };
}

export interface GetRoomRepsonse {
  success: boolean;
  rooms: RoomCardDetails[];
}
