import CreateLeaseScreen from '@/features/lease/components/CreateLeaseScreen';
import { roomsWithDetails, tenants } from '@/features/home/dummy';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateLeaseRoute() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const insets = useSafeAreaInsets();

  const availableRooms = roomsWithDetails.filter(
    (room) => room.status === 'AVAILABLE' && room.active_lease === null,
  );

  if (availableRooms.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center bg-slate-100 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-extrabold text-slate-900">No vacant rooms</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          Create a lease after a room becomes available.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <CreateLeaseScreen
        rooms={availableRooms}
        tenants={tenants}
        initialRoomId={roomId ? Number(roomId) : undefined}
        onBack={() => router.back()}
        onCreated={() => router.back()}
      />
    </>
  );
}
