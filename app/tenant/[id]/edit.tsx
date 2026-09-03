import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tenants } from '@/features/home/dummy';
import AddTenantScreen from '@/features/tenant/components/AddTenantScreen';

export default function EditTenantRoute() {
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
      <AddTenantScreen
        tenant={tenant}
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
