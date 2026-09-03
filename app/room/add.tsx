import AddRoomScreen from '@/features/room/components/AddRoomScreen';
import { floors, owner } from '@/features/home/dummy';
import { Stack, router } from 'expo-router';

export default function AddRoomRoute() {
  const ownerFloors = floors
    .filter((floor) => floor.owner_id === owner.id)
    .sort((a, b) => a.floor_number - b.floor_number);

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddRoomScreen
        floors={ownerFloors}
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
