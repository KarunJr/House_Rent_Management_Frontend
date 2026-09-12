import { create } from 'zustand';
import { RoomFormData } from './room.validation';
import { addRoomApi, getRoomApi } from './room.api';
import { AddRoomResponse, GetRoomRepsonse, RoomCardDetails } from './room.types';

interface RoomStore {
  isLoading: boolean;
  rooms: RoomCardDetails[] | null;
  fetchError: string | null;

  addRoom: (data: RoomFormData) => Promise<AddRoomResponse>;
  getRoom: () => Promise<GetRoomRepsonse>;
}

export const useRoomStore = create<RoomStore>()((set) => ({
  isLoading: true,
  rooms: null,
  fetchError: null,

  addRoom: async (data: RoomFormData) => {
    try {
      const response = await addRoomApi<AddRoomResponse>(data);
      const result = response.data;
      if (result.success && result.roomDetails) {
        set({ isLoading: false });
      }
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getRoom: async () => {
    set({ isLoading: true, fetchError: null });
    try {
      const response = await getRoomApi<GetRoomRepsonse>();
      const result = response.data;
      if (result.success && result.rooms) {
        set({ rooms: result.rooms });
      } else {
        throw new Error('Unable to load rooms.');
      }
      return result;
    } catch (error) {
      set({ fetchError: 'We couldn’t load your rooms. Please try again.' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
