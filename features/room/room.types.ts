import { RoomStatus } from '../home/home.types';

export interface RoomDetails {
  id: string;
  roomName: string;
  floorId: string;
  baseRentAmount: number;
  status: RoomStatus;
  createdAt: string;
}
export interface AddRoomResponse {
  success: boolean;
  message: string;
  roomDetails: RoomDetails | null;
}

// The create and edit endpoints both return RoomResponseDto.
export type EditRoomResponse = AddRoomResponse;

export interface RoomCardDetails {
  id: string;
  roomName: string;
  floorId: string;
  baseRentAmount: number;
  status: RoomStatus;
  /** True for an active lease or an open-ended reservation, not ended lease history. */
  hasLease: boolean;
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
export interface GetSingleRoomRepsonse {
  success: boolean;
  message: string;
  roomDetails: RoomCardDetails | null;
}
