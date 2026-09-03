import AddTenantScreen from '@/features/tenant/components/AddTenantScreen';
import { type Href, Stack, router } from 'expo-router';

export default function AddTenantRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddTenantScreen
        onBack={() => router.back()}
        onSaved={() => router.back()}
        onViewTenants={() => router.push('/tenant' as Href)}
      />
    </>
  );
}
