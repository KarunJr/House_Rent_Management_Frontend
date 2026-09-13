import { type Href, Stack, router } from 'expo-router';
import { LoadingState } from '@/components/ui/LoadingState';
import TenantListScreen from '@/features/tenant/components/TenantListScreen';
import { TenantLoadError } from '@/features/tenant/components/TenantLoadError';
import { useTenantList } from '@/features/tenant/hooks/useTenantList';

export default function TenantListRoute() {
  const { tenants, isLoading, error, retry } = useTenantList();

  if (isLoading) return <LoadingState message="Loading tenants" />;
  if (error) {
    return (
      <TenantLoadError
        title="Unable to load tenants"
        message={error}
        onBack={() => router.back()}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <TenantListScreen
        items={tenants}
        onBack={() => router.back()}
        onAdd={() => router.push('/tenant/add')}
        onTenantPress={(tenantId) => router.push(`/tenant/${tenantId}` as Href)}
      />
    </>
  );
}
