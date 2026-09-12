import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface RoomListStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onAddRoom: () => void;
}

export default function RoomListState({
  isLoading,
  error,
  onRetry,
  onAddRoom,
}: RoomListStateProps) {
  const title = isLoading ? 'Loading your rooms' : error ? 'Unable to load rooms' : 'No rooms yet';
  const description = isLoading
    ? 'Getting your spaces ready to view.'
    : error ?? 'Add your first room to start managing tenants, leases, and rent in one place.';

  return (
    <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-9">
      <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-teal-50">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-teal-100">
          {isLoading ? (
            <ActivityIndicator size="large" color="#0F766E" accessibilityLabel="Loading rooms" />
          ) : (
            <Ionicons
              name={error ? 'cloud-offline-outline' : 'home-outline'}
              size={32}
              color="#0F766E"
              accessible={false}
            />
          )}
        </View>
      </View>

      <View accessibilityLiveRegion="polite" className="items-center">
        <Text className="text-center text-lg font-extrabold text-[#0D1F3C]">{title}</Text>
        <Text className="mt-2 max-w-[280px] text-center text-sm leading-6 text-slate-500">
          {description}
        </Text>
      </View>

      {!isLoading && (
        <Pressable
          accessibilityRole="button"
          onPress={error ? onRetry : onAddRoom}
          className="mt-6 min-h-[48px] flex-row items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 active:opacity-80"
        >
          <Ionicons name={error ? 'refresh-outline' : 'add'} size={20} color="#FFFFFF" />
          <Text className="text-sm font-bold text-white">
            {error ? 'Try again' : 'Add your first room'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
