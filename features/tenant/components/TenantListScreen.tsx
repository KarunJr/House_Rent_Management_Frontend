import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { TenantListItem } from '../tenant.types';
import { Avatar } from '@/features/home/components/ui/Avatar';

interface TenantListScreenProps {
  items: TenantListItem[];
  onBack: () => void;
  onAdd: () => void;
  onTenantPress: (tenantId: string) => void;
}

export default function TenantListScreen({ items, onBack, onAdd, onTenantPress }: TenantListScreenProps) {
  const activeLeaseCount = items.reduce((count, tenant) => count + tenant.activeLeases.length, 0);

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
            <Text className="mt-2 text-3xl font-extrabold text-teal-700">{activeLeaseCount}</Text>
          </View>
        </View>

        <Text className="mb-3 text-sm font-bold uppercase tracking-[1px] text-slate-500">All tenants</Text>
        <View className="gap-3">
          {items.length === 0 && (
            <View className="rounded-2xl border border-slate-200 bg-white px-4 py-5">
              <Text className="text-sm font-semibold text-slate-700">No tenants yet</Text>
              <Text className="mt-1 text-xs leading-5 text-slate-500">Add your first tenant using the + button above.</Text>
            </View>
          )}
          {items.map((tenant) => (
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
                      {tenant.activeLeases.length > 0
                        ? `${tenant.activeLeases.length === 1 ? 'Room' : 'Rooms'} ${tenant.activeLeases.map((lease) => lease.room.roomName).join(', ')}`
                        : 'No active lease'}
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
