import RoomDetailScreen from '@/features/home/components/RoomDetailScreen';
import { invoices, payments, roomsWithDetails } from '@/features/home/dummy';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RoomDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const roomId = Number(id);
  const room = roomsWithDetails.find((item) => item.id === roomId) ?? null;
  const invoiceHistory = room?.active_lease
    ? invoices
        .filter((invoice) => invoice.lease_id === room.active_lease?.id)
        .sort(
          (a, b) =>
            new Date(b.billing_month).getTime() - new Date(a.billing_month).getTime(),
        )
    : [];

  if (!room) {
    return (
      <View
        className="flex-1 items-center justify-center bg-slate-100 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-extrabold text-slate-900">Room not found</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          We could not find a room for id {id ?? 'unknown'}.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <RoomDetailScreen
        room={room}
        invoiceHistory={invoiceHistory}
        payments={payments}
        onBack={() => router.back()}
        onEdit={() =>
          router.push({
            pathname: '/room/[id]/edit',
            params: { id: String(room.id) },
          })
        }
      />
    </>
  );
}
