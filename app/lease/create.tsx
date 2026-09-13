import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import CreateLeaseScreen from '@/features/lease/components/CreateLeaseScreen';
import { LeaseLoadState } from '@/features/lease/components/LeaseLoadState';
import { useLeaseOptions } from '@/features/lease/hooks/useLeaseOptions';

export default function CreateLeaseRoute() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const { rooms, tenants, isLoading, error, retry } = useLeaseOptions();

  if (isLoading) return <LoadingState message="Loading rooms and tenants" />;
  if (error) {
    return (
      <LeaseLoadState
        title="Unable to load lease details"
        message={error}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }
  if (rooms.length === 0) {
    return (
      <LeaseLoadState
        title="No rooms available"
        message="Create a lease after a room becomes available."
        onBack={() => router.back()}
        onRetry={retry}
        actionLabel="Add Room"
        onAction={() => router.push('/room/add')}
      />
    );
  }
  if (tenants.length === 0) {
    return (
      <LeaseLoadState
        title="No tenants yet"
        message="Add a tenant before creating a lease."
        onBack={() => router.back()}
        onRetry={retry}
        actionLabel="Add Tenant"
        onAction={() => router.push('/tenant/add')}
      />
    );
  }
  if (roomId && !rooms.some((room) => room.id === roomId)) {
    return (
      <LeaseLoadState
        title="Room unavailable"
        message="The selected room is no longer available for a new lease."
        onBack={() => router.back()}
        onRetry={retry}
        actionLabel="Choose another room"
        onAction={() => router.setParams({ roomId: '' })}
      />
    );
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <CreateLeaseScreen
        rooms={rooms}
        tenants={tenants}
        initialRoomId={roomId}
        onBack={() => router.back()}
        onCreated={() => router.back()}
      />
    </>
  );
}
