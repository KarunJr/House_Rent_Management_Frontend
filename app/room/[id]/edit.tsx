import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import AddRoomScreen from '@/features/room/components/AddRoomScreen';
import { RoomLoadError } from '@/features/room/components/RoomLoadError';
import { useRoomDetails } from '@/features/room/hooks/useRoomDetails';

export default function EditRoomRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, isLoading, error, notFound, retry } = useRoomDetails(id);

  if (isLoading) return <LoadingState message="Loading room details" />;

  if (!room) {
    return (
      <RoomLoadError
        title={notFound ? 'Room not found' : 'Unable to load room'}
        message={notFound ? 'This room could not be found.' : (error ?? 'Please try again.')}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddRoomScreen
        key={room.id}
        room={room}
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
