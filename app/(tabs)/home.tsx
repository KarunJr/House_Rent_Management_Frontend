import { Avatar } from '@/features/home/components/ui/Avatar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { roomsWithDetails, stats } from '@/features/home/dummy';
import RoomCard from '@/features/home/components/RoomCard';
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const occupancyPct =
    stats.totalRooms > 0 ? Math.round((stats.occupied / stats.totalRooms) * 100) : 0;

  const filteredRooms = roomsWithDetails;
  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      {/* Top Bar */}
      <View className="h-18 px-6 py-2 mb-2">
        <View className="justify-betweenmb-6">
          <View className="flex-row items-center gap-3">
            <Avatar
              uri="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              name="Karun Ghimire"
            />
            <View className="">
              <Text className="text-gray-500">Welcome back,</Text>
              <Text className="text-gray-800 font-medium text-xl">Karun</Text>
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
        {/* Decorative circles */}
        <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />

        <View className="absolute -right-2 top-10 h-20 w-20 rounded-full bg-[#14B8A6]/20" />

        <View className="p-5">
          {/* Month */}
          <Text className="mb-1 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            August 2026
          </Text>

          {/* Occupancy */}
          <Text className="text-2xl font-extrabold leading-8 text-white">
            {occupancyPct}% Occupied
          </Text>

          {/* Pending payments */}
          <Text className="mb-4 text-base font-semibold text-white/70">
            {stats.pendingPayments} payments still pending
          </Text>

          {/* Progress bar */}
          <View className="mb-4 h-2 overflow-hidden rounded-full bg-white/20">
            <View
              className="h-full rounded-full bg-[#14B8A6]"
              style={{
                width: `${occupancyPct}%`,
              }}
            />
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row flex-wrap items-center gap-2">
              <View className="rounded-xl bg-white/15 px-3 py-2">
                <Text className="text-xs font-semibold text-white">{stats.occupied} Occupied</Text>
              </View>

              <View className="rounded-xl bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold text-white/70">{stats.vacant} Vacant</Text>
              </View>

              {stats.vacant > 0 && (
                <View className="rounded-xl bg-amber-400 px-3 py-2">
                  <Text className="text-xs font-bold text-amber-900">Assign tenants →</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="mx-5 mb-5 flex-row gap-3">
        {/* Total Rooms */}
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#F0FDF9] p-3.5">
          <Text className="text-2xl font-extrabold text-[#0D9488] leading-none">
            {stats.totalRooms}
          </Text>
          <Text className="mt-1 text-[11px] font-medium text-gray-500">Total Rooms</Text>
        </View>

        {/* Pending */}
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#FFFBEB] p-3.5">
          <Text className="text-2xl font-extrabold text-amber-600 leading-none">
            {stats.pendingPayments}
          </Text>
          <Text className="mt-1 text-[11px] font-medium text-gray-500">Pending</Text>
        </View>

        {/* Collected */}
        <View className="flex-1 items-center justify-center rounded-2xl bg-[#F0FDF4] p-3.5">
          <Text className="text-xl font-extrabold text-emerald-600 leading-none">
            रू {(stats.monthlyRevenue / 1000).toFixed(0)}k
          </Text>
          <Text className="mt-1 text-[11px] font-medium text-gray-500">Collected</Text>
        </View>
      </View>

      {/* Rooms */}
      <View className="mx-5 flex-1">
        {/* Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base font-extrabold text-[#0D1F3C]">
            Rooms ({filteredRooms.length})
          </Text>
        </View>

        {/* Room list */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onPress={(id) => router.push(`/room/${id}`)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
