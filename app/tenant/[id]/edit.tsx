import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import AddTenantScreen from '@/features/tenant/components/AddTenantScreen';
import { TenantLoadError } from '@/features/tenant/components/TenantLoadError';
import { useTenantDetails } from '@/features/tenant/hooks/useTenantDetails';

export default function EditTenantRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tenant, isLoading, error, notFound, retry } = useTenantDetails(id);

  if (isLoading) return <LoadingState message="Loading tenant details" />;
  if (!tenant) {
    return (
      <TenantLoadError
        title={notFound ? 'Tenant not found' : 'Unable to load tenant'}
        message={notFound ? 'This tenant could not be found.' : error ?? 'Please try again.'}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <AddTenantScreen
        key={tenant.id}
        tenant={tenant}
        onBack={() => router.back()}
        onSaved={() => router.back()}
      />
    </>
  );
}
