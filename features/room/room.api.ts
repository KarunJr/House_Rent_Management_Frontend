import api from '@/lib/client';
import { AddRoomFormData } from './room.validation';

export const addRoomApi = <T>(data: AddRoomFormData) => {
  return api.post<T>('/v1/api/room', data);
};

export const getRoomApi = <T>() => {
    return api.get<T>('/v1/api/room');
};
