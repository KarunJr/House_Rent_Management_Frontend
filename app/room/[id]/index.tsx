import { LoadingState } from '@/components/ui/LoadingState';
import RoomDetailScreen from '@/features/home/components/RoomDetailScreen';
import { RoomLoadError } from '@/features/room/components/RoomLoadError';
import { useRoomDetails } from '@/features/room/hooks/useRoomDetails';
import { type Href, Stack, router, useLocalSearchParams } from 'expo-router';

export default function RoomDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, isLoading, error, notFound, retry } = useRoomDetails(id);

  if (isLoading) return <LoadingState message="Loading room details" />;

  if (!room) {
    return (
      <RoomLoadError
        title={notFound ? 'Room not found' : 'Unable to load room'}
        message={notFound ? 'This room could not be found.' : error ?? 'Please try again.'}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <RoomDetailScreen
        room={room}
        // invoiceHistory={invoiceHistory}
        // payments={payments}
        onBack={() => router.back()}
        onEdit={() =>
          router.push({
            pathname: '/room/[id]/edit',
            params: { id: String(room.id) },
          })
        }
        onEndLease={() => router.push(`/room/${room.id}/end-lease` as Href)}
        onTenantPress={(tenantId) => router.push(`/tenant/${tenantId}` as Href)}
      />
    </>
  );
}
