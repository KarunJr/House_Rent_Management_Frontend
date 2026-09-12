import api from '@/lib/client';
import { AddRoomFormData } from './room.validation';
import type { EditRoomResponse } from './room.types';

export const editRoomApi = (id: string, data: AddRoomFormData) => {
  return api.put<EditRoomResponse>(`/v1/api/room/${id}`, data);
};

export const addRoomApi = <T>(data: AddRoomFormData) => {
  return api.post<T>('/v1/api/room', data);
};

export const getRoomApi = <T>() => {
  return api.get<T>('/v1/api/room');
};

export const getSingleRoomApi = <T>(id: string) => {
  console.log('Calling the actual route');
  return api.get<T>(`/v1/api/room/${id}`);
};
