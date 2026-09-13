import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getRoomApi } from '@/features/room/room.api';
import type { GetRoomRepsonse, RoomCardDetails } from '@/features/room/room.types';
import { getTenantsApi } from '@/features/tenant/tenant.api';
import type { TenantListItem } from '@/features/tenant/tenant.types';
import { handleError } from '@/helpers/axios.error';

export function useLeaseOptions() {
  const isFocused = useIsFocused();
  const [rooms, setRooms] = useState<RoomCardDetails[]>([]);
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isFocused) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    async function loadOptions() {
      try {
        const [roomResponse, tenantResponse] = await Promise.all([
          getRoomApi<GetRoomRepsonse>(controller.signal),
          getTenantsApi(controller.signal),
        ]);
        if (controller.signal.aborted) return;
        if (!roomResponse.data.success || !tenantResponse.data.success) {
          throw new Error('Unable to load rooms and tenants. Please try again.');
        }
        setRooms(
          roomResponse.data.rooms.filter(
            (room) => room.status === 'Available' && !room.hasLease && room.activeLease === null,
          ),
        );
        // A tenant may hold multiple leases; the backend checks room availability.
        setTenants(tenantResponse.data.tenants);
      } catch (error) {
        if (!controller.signal.aborted) setError(handleError(error).message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void loadOptions();
    return () => controller.abort();
  }, [isFocused, retryCount]);

  return { rooms, tenants, isLoading, error, retry: () => setRetryCount((value) => value + 1) };
}
