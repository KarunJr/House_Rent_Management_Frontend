import { create } from 'zustand';
import { addRoomApi, editRoomApi, getRoomApi } from './room.api';
import { AddRoomResponse, EditRoomResponse, GetRoomRepsonse, RoomCardDetails } from './room.types';
import { RoomFormData } from './room.validation';

interface RoomStore {
  isLoading: boolean;
  // hasFetched: boolean;
  rooms: RoomCardDetails[];
  fetchError: string | null;

  addRoom: (data: RoomFormData) => Promise<AddRoomResponse>;
  editRoom: (id: string, data: RoomFormData) => Promise<EditRoomResponse>;
  getRoom: () => Promise<GetRoomRepsonse>;
}

export const useRoomStore = create<RoomStore>()((set) => ({
  isLoading: true,
  // hasFetched: false,
  rooms: [],
  fetchError: null,

  editRoom: async (id, data) => {
    const { data: result } = await editRoomApi(id, data);
    const savedRoom = result.roomDetails;
    if (result.success && savedRoom) {
      set((state) => ({
        // PUT does not return activeLease; retain it from the existing list entry.
        rooms: state.rooms.map((room) =>
          room.id === savedRoom.id ? { ...room, ...savedRoom } : room,
        ),
      }));
    }
    return result;
  },

  addRoom: async (data: RoomFormData) => {
    try {
      const response = await addRoomApi<AddRoomResponse>(data);
      const result = response.data;
      const room = result.roomDetails;
      if (result.success && room) {
        set((state) => ({
          rooms: [
            ...state.rooms,
            {
              id: room.id,
              roomName: room.roomName,
              floorId: room.floorId,
              baseRentAmount: room.baseRentAmount,
              status: room.status,
              activeLease: null,
            },
          ],
        }));
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
