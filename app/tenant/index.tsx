import { type Href, Stack, router } from 'expo-router';

import TenantListScreen, {
  type TenantListItem,
} from '@/features/tenant/components/TenantListScreen';
import { leases, rooms, tenants } from '@/features/home/dummy';

export default function TenantListRoute() {
  const items: TenantListItem[] = tenants
    .map((tenant) => {
      const activeLease =
        leases.find((lease) => lease.tenant_id === tenant.id && lease.is_active) ?? null;
      const room = activeLease
        ? (rooms.find((item) => item.id === activeLease.room_id) ?? null)
        : null;

      return { tenant, activeLease, room };
    })
    .sort((a, b) => Number(Boolean(b.activeLease)) - Number(Boolean(a.activeLease)));

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <TenantListScreen
        items={items}
        onBack={() => router.back()}
        onAdd={() => router.push('/tenant/add')}
        onTenantPress={(tenantId) => router.push(`/tenant/${tenantId}` as Href)}
      />
    </>
  );
}
