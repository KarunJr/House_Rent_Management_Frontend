import AddRoomScreen from '@/features/room/components/AddRoomScreen';
import { Stack, router } from 'expo-router';

export default function AddRoomRoute() {

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddRoomScreen
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
