import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { Lease, Room, Tenant } from '@/features/home/home.types';
import { Avatar } from '@/features/home/components/ui/Avatar';

export interface TenantListItem {
  tenant: Tenant;
  activeLease: Lease | null;
  room: Room | null;
}

interface TenantListScreenProps {
  items: TenantListItem[];
  onBack: () => void;
  onAdd: () => void;
  onTenantPress: (tenantId: number) => void;
}

export default function TenantListScreen({ items, onBack, onAdd, onTenantPress }: TenantListScreenProps) {
  const activeTenantCount = items.filter((item) => item.activeLease).length;

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Tenants"
          onBack={onBack}
          right={
            <Pressable
              onPress={onAdd}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-[#14B8A6]"
            >
              <Ionicons name="add" size={23} color="#FFFFFF" />
            </Pressable>
          }
        />

        <View className="mb-6">
          <Text className="text-3xl font-extrabold tracking-tight text-slate-900">People in your property</Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Keep tenant contacts and their current room information in one place.
          </Text>
        </View>

        <View className="mb-5 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-[#0D1F3C] px-4 py-4">
            <Text className="text-xs font-bold uppercase tracking-[1px] text-slate-300">Total tenants</Text>
            <Text className="mt-2 text-3xl font-extrabold text-white">{items.length}</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-teal-100 bg-[#F0FDFA] px-4 py-4">
            <Text className="text-xs font-bold uppercase tracking-[1px] text-teal-700">Active leases</Text>
            <Text className="mt-2 text-3xl font-extrabold text-teal-700">{activeTenantCount}</Text>
          </View>
        </View>

        <Text className="mb-3 text-sm font-bold uppercase tracking-[1px] text-slate-500">All tenants</Text>
        <View className="gap-3">
          {items.map(({ tenant, activeLease, room }) => (
            <Pressable
              key={tenant.id}
              onPress={() => onTenantPress(tenant.id)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
              style={{
                shadowColor: '#0F172A',
                shadowOpacity: 0.04,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 3 },
                elevation: 1,
              }}
            >
              <View className="flex-row items-center gap-3">
                <Avatar name={tenant.name} size={46} />
                <View className="min-w-0 flex-1">
                  <Text className="text-base font-extrabold text-slate-900">{tenant.name}</Text>
                  <Text className="mt-1 text-xs text-slate-500">{tenant.phone}</Text>
                  <View className="mt-2 self-start rounded-full bg-slate-100 px-2.5 py-1">
                    <Text className="text-[11px] font-bold text-slate-600">
                      {activeLease && room ? `Room ${room.room_name}` : 'No active lease'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
