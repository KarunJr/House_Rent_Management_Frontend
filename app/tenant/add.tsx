import AddTenantScreen from '@/features/tenant/components/AddTenantScreen';
import { Stack, router } from 'expo-router';

export default function AddTenantRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddTenantScreen onBack={() => router.back()} onCreated={() => router.back()} />
    </>
  );
}
