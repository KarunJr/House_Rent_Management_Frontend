import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { handleError } from '@/helpers/axios.error';
import { getSingleRoomApi } from '../room.api';
import type { GetSingleRoomRepsonse, RoomCardDetails } from '../room.types';

export function useRoomDetails(id: string | undefined) {
  const isFocused = useIsFocused();
  const [room, setRoom] = useState<RoomCardDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setRoom(null);
    setError(null);
    setNotFound(false);

    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    async function loadRoom(roomId: string) {
      try {
        const { data } = await getSingleRoomApi<GetSingleRoomRepsonse>(roomId);
        if (!active) return;
        if (data.success && data.roomDetails) {
          setRoom(data.roomDetails);
        } else {
          setError(data.message || 'Unable to load this room.');
        }
      } catch (error) {
        if (!active) return;
        const failure = handleError(error);
        setNotFound(failure.status === 404);
        setError(failure.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadRoom(id);

    return () => {
      active = false;
    };
  }, [id, isFocused, retryCount]);

  return { room, isLoading, error, notFound, retry: () => setRetryCount((value) => value + 1) };
}
