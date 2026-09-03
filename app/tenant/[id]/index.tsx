import { type Href, Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TenantDetailScreen from '@/features/tenant/components/TenantDetailScreen';
import { leases, rooms, tenants } from '@/features/home/dummy';

export default function TenantDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const tenant = tenants.find((item) => item.id === Number(id)) ?? null;

  if (!tenant) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-6" style={{ paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-extrabold text-slate-900">Tenant not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <TenantDetailScreen
        tenant={tenant}
        leases={leases.filter((lease) => lease.tenant_id === tenant.id)}
        rooms={rooms}
        onBack={() => router.back()}
        onEdit={() => router.push(`/tenant/${tenant.id}/edit` as Href)}
        onRoomPress={(roomId) => router.push(`/room/${roomId}` as Href)}
      />
    </>
  );
}
