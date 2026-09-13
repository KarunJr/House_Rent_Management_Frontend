import { type Href, Stack, router, useLocalSearchParams } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import TenantDetailScreen from '@/features/tenant/components/TenantDetailScreen';
import { TenantLoadError } from '@/features/tenant/components/TenantLoadError';
import { useTenantDetails } from '@/features/tenant/hooks/useTenantDetails';

export default function TenantDetailsRoute() {
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
      <TenantDetailScreen
        tenant={tenant}
        onBack={() => router.back()}
        onEdit={() => router.push(`/tenant/${tenant.id}/edit` as Href)}
        onRoomPress={(roomId) => router.push(`/room/${roomId}` as Href)}
      />
    </>
  );
}
