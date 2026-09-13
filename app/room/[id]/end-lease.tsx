import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import EndLeaseScreen from '@/features/lease/components/EndLeaseScreen';
import { LeaseLoadState } from '@/features/lease/components/LeaseLoadState';
import { useRoomDetails } from '@/features/room/hooks/useRoomDetails';

export default function EndLeaseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, isLoading, error, notFound, retry } = useRoomDetails(id);

  if (isLoading) return <LoadingState message="Loading active lease" />;
  if (!room) {
    return (
      <LeaseLoadState
        title={notFound ? 'Room not found' : 'Unable to load room'}
        message={notFound ? 'This room could not be found.' : (error ?? 'Please try again.')}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }
  if (!room.activeLease) {
    return (
      <LeaseLoadState
        title="No active lease"
        message="This room does not have an active tenant to move out."
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <EndLeaseScreen
        key={room.activeLease.id}
        room={room}
        activeLease={room.activeLease}
        onBack={() => router.back()}
        onEnded={() => router.back()}
      />
    </>
  );
}
