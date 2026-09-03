import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { roomsWithDetails } from '@/features/home/dummy';
import EndLeaseScreen from '@/features/lease/components/EndLeaseScreen';

export default function EndLeaseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const room = roomsWithDetails.find((item) => item.id === Number(id)) ?? null;

  if (!room?.active_lease) {
    return (
      <View
        className="flex-1 items-center justify-center bg-slate-100 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-extrabold text-slate-900">No active lease</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          This room does not have an active tenant to move out.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <EndLeaseScreen room={room} onBack={() => router.back()} onEnded={() => router.back()} />
    </>
  );
}
