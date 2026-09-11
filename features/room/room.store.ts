import { create } from 'zustand';
import { RoomFormData } from './room.validation';
import { addRoomApi, getRoomApi } from './room.api';
import { AddRoomResponse, GetRoomRepsonse, RoomCard } from './room.types';

interface RoomStore {
  isLoading: boolean;
  rooms: RoomCard[] | null;

  addRoom: (data: RoomFormData) => Promise<AddRoomResponse>;
  getRoom: () => Promise<GetRoomRepsonse>;
}

export const useRoomStore = create<RoomStore>()((set) => ({
  isLoading: true,
  rooms: null,

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
    try {
        const response = await getRoomApi<GetRoomRepsonse>();
        const result = response.data;

        if(result.success && result.rooms){
            set({isLoading: false, rooms: result.rooms});
        }
        return result;
    } catch (error) {
        throw error;
    }
  },
}));
