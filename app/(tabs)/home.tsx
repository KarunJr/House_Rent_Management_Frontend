import { Avatar } from '@/features/home/components/ui/Avatar';
import { toast } from '@/components/toast';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { roomsWithDetails, stats } from '@/features/home/dummy';
import RoomCard from '@/features/home/components/RoomCard';
import QuickActionCard from '@/features/home/components/QuickActionCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const filteredRooms = roomsWithDetails;

  const occupancyPct =
    stats.totalRooms > 0 ? Math.round((stats.occupied / stats.totalRooms) * 100) : 0;

  const vacantRooms = filteredRooms.filter(
    (room) => room.status === 'AVAILABLE' || room.active_lease === null,
  );
  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Top Bar */}
        <View className="mb-2 h-18 px-6 py-2">
          <View className="justify-betweenmb-6">
            <View className="flex-row items-center gap-3">
              <Avatar
                uri="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                name="Karun Ghimire"
              />
              <View>
                <Text className="text-gray-500">Welcome back,</Text>
                <Text className="text-xl font-medium text-gray-800">Karun</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Banner */}
        <LinearGradient
          colors={['#0D1F3C', '#1A3560', '#14B8A6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6, 1]}
          className="mx-5 mb-5 overflow-hidden rounded-3xl"
        >
          <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
          <View className="absolute -right-2 top-10 h-20 w-20 rounded-full bg-[#14B8A6]/20" />

          <View className="p-5">
            <Text className="mb-1 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              August 2026
            </Text>

            <Text className="text-2xl font-extrabold leading-8 text-white">
              {occupancyPct}% Occupied
            </Text>

            <Text className="mb-4 text-base font-semibold text-white/70">
              {stats.pendingPayments} payments still pending
            </Text>

            <View className="mb-4 h-2 overflow-hidden rounded-full bg-white/20">
              <View
                className="h-full rounded-full bg-[#14B8A6]"
                style={{
                  width: `${occupancyPct}%`,
                }}
              />
            </View>

            <View className="flex-row flex-wrap items-center gap-2">
              <View className="rounded-xl bg-white/15 px-3 py-2">
                <Text className="text-xs font-semibold text-white">{stats.occupied} Occupied</Text>
              </View>

              <View className="rounded-xl bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold text-white/70">{stats.vacant} Vacant</Text>
              </View>

              {stats.vacant > 0 && (
                <View className="rounded-xl bg-amber-400 px-3 py-2">
                  <Text className="text-xs font-bold text-amber-900">Assign tenants</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View className="mx-5 mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-extrabold text-[#0D1F3C]">Quick Actions</Text>
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-400">
              Start here
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row gap-3">
              <QuickActionCard
                label="Add Room"
                caption="Create a new rentable space."
                icon="home-outline"
                tone={{
                  background: '#F0FDF9',
                  border: '#CCFBF1',
                  iconBackground: '#CCFBF1',
                  iconColor: '#0F766E',
                  titleColor: '#0D9488',
                }}
                onPress={() => router.push('/room/add')}
              />

              <QuickActionCard
                label="Add Tenant"
                caption="Save tenant details for leasing."
                icon="people-outline"
                tone={{
                  background: '#FFF7ED',
                  border: '#FED7AA',
                  iconBackground: '#FFEDD5',
                  iconColor: '#C2410C',
                  titleColor: '#EA580C',
                }}
                onPress={() => router.push('/tenant/add')}
              />
            </View>

              <QuickActionCard
                label="Create Lease"
                caption="Open the next vacant room and assign it."
                icon="document-text-outline"
              tone={{
                background: '#EFF6FF',
                border: '#BFDBFE',
                iconBackground: '#DBEAFE',
                iconColor: '#1D4ED8',
                titleColor: '#1E40AF',
              }}
              onPress={() => {
                if (!vacantRooms[0]?.id) {
                  toast.info('No vacant rooms are available right now.', {
                    title: 'Create Lease',
                  });
                  return;
                }

                router.push({
                  pathname: '/lease/create',
                  params: { roomId: String(vacantRooms[0].id) },
                });
              }}
            />
          </View>
        </View>

        {/* Rooms */}
        <View className="mx-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-extrabold text-[#0D1F3C]">
              Rooms ({filteredRooms.length})
            </Text>
          </View>

          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onPress={(id) => router.push(`/room/${id}`)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
