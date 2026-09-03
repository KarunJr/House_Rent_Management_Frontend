import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/features/home/components/ui/Avatar';
import type { Lease, Room, Tenant } from '@/features/home/home.types';
import { useDatePreferenceStore } from '@/features/settings/date-preference.store';
import { formatCanonicalDateForMode } from '@/features/settings/date.utils';

interface TenantDetailScreenProps {
  tenant: Tenant;
  leases: Lease[];
  rooms: Room[];
  onBack: () => void;
  onEdit: () => void;
  onRoomPress: (roomId: number) => void;
}

export default function TenantDetailScreen({
  tenant,
  leases,
  rooms,
  onBack,
  onEdit,
  onRoomPress,
}: TenantDetailScreenProps) {
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);
  const orderedLeases = [...leases].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );
  const activeLease = orderedLeases.find((lease) => lease.is_active) ?? null;
  const activeRoom = activeLease ? rooms.find((room) => room.id === activeLease.room_id) ?? null : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Tenant Details"
          onBack={onBack}
          right={
            <Pressable onPress={onEdit} className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
              <Ionicons name="pencil-outline" size={19} color="#0F172A" />
            </Pressable>
          }
        />

        <View className="items-center rounded-3xl bg-[#0D1F3C] px-5 pb-6 pt-7">
          <Avatar name={tenant.name} size={72} />
          <Text className="mt-4 text-2xl font-extrabold text-white">{tenant.name}</Text>
          <Text className="mt-1 text-sm text-slate-300">Tenant profile</Text>
          <View className="mt-5 rounded-full bg-white/10 px-3 py-1.5">
            <Text className="text-xs font-bold text-[#5EEAD4]">
              {activeRoom ? `Currently in Room ${activeRoom.room_name}` : 'No active lease'}
            </Text>
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-bold uppercase tracking-[1px] text-slate-500">Contact</Text>
          <View className="rounded-2xl border border-slate-200 bg-white">
            <View className="flex-row items-center gap-3 px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Ionicons name="call-outline" size={18} color="#0F766E" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400">Phone number</Text>
                <Text className="mt-1 text-sm font-bold text-slate-800">{tenant.phone}</Text>
              </View>
            </View>
            <View className="mx-4 h-px bg-slate-100" />
            <View className="flex-row items-center gap-3 px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Ionicons name="mail-outline" size={18} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400">Email address</Text>
                <Text className="mt-1 text-sm font-bold text-slate-800">{tenant.email ?? 'Not provided'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-bold uppercase tracking-[1px] text-slate-500">Lease history</Text>
          {orderedLeases.length === 0 ? (
            <View className="rounded-2xl border border-slate-200 bg-white px-4 py-5">
              <Text className="text-sm font-semibold text-slate-700">No lease history yet</Text>
              <Text className="mt-1 text-xs leading-5 text-slate-500">Create a lease when this tenant moves into a room.</Text>
            </View>
          ) : (
            <View className="gap-3">
              {orderedLeases.map((lease) => {
                const room = rooms.find((item) => item.id === lease.room_id) ?? null;
                const isActive = lease.is_active;

                return (
                  <Pressable
                    key={lease.id}
                    disabled={!room}
                    onPress={() => room && onRoomPress(room.id)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="min-w-0 flex-1">
                        <Text className="text-base font-extrabold text-slate-900">Room {room?.room_name ?? '-'}</Text>
                        <Text className="mt-1 text-xs leading-5 text-slate-500">
                          Started {formatCanonicalDateForMode(lease.start_date, calendarMode)}
                        </Text>
                      </View>
                      <View className={`rounded-full px-3 py-1 ${isActive ? 'bg-teal-50' : 'bg-slate-100'}`}>
                        <Text className={`text-[11px] font-bold ${isActive ? 'text-teal-700' : 'text-slate-600'}`}>
                          {isActive ? 'Active' : 'Ended'}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
