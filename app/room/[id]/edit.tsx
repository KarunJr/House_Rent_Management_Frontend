import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { floors, owner, rooms } from '@/features/home/dummy';
import AddRoomScreen from '@/features/room/components/AddRoomScreen';

export default function EditRoomRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const room = rooms.find((item) => item.id === Number(id));
  const ownerFloors = floors
    .filter((floor) => floor.owner_id === owner.id)
    .sort((a, b) => a.floor_number - b.floor_number);

  if (!room) {
    return (
      <View
        className="flex-1 items-center justify-center bg-slate-100 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-extrabold text-slate-900">Room not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddRoomScreen
        floors={ownerFloors}
        room={room}
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
