import { Pressable, Text, View } from 'react-native';

import { invoiceStatusToBadge, type RoomWithDetails } from '../home.types';
import { Avatar } from './ui/Avatar';
import Badge from './ui/StatusBadge';

interface RoomCardProps {
  room: RoomWithDetails;
  onPress: (id: number) => void;
}

const floorLabel = (floorNumber: number) => {
  if (floorNumber === 1) return '1st Floor';
  if (floorNumber === 2) return '2nd Floor';
  if (floorNumber === 3) return '3rd Floor';

  return `${floorNumber}th Floor`;
};

const getAccentColor = (status: RoomWithDetails['status']) => {
  switch (status) {
    case 'OCCUPIED':
      return '#14B8A6';

    case 'AVAILABLE':
      return '#F59E0B';

    case 'MAINTENANCE':
      return '#F97316';

    default:
      return '#6B7280';
  }
};

const formatCurrency = (amount: number) => {
  return `रू ${amount.toLocaleString('en-IN')}`;
};

const formatDate = (date: string) => {
  const parsed = new Date(date);

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

export default function RoomCard({ room, onPress }: RoomCardProps) {
  const accentColor = getAccentColor(room.status);
  const isVacant = room.status === 'AVAILABLE' || room.active_lease === null;
  const isMaintenance = room.status === 'MAINTENANCE';
  const tenant = room.tenant;
  const rentAmount = room.active_lease?.monthly_rent ?? room.base_rent_amount;
  const badgeStatus = isMaintenance
    ? 'maintenance'
    : isVacant
      ? 'vacant'
      : room.current_invoice
        ? invoiceStatusToBadge(room.current_invoice.status)
        : 'pending';

  return (
    <View
      className="mb-3 rounded-3xl"
      style={{
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      }}
    >
      <Pressable
        onPress={() => onPress(room.id)}
        className="overflow-hidden rounded-3xl bg-white px-4 py-4 active:scale-[0.99]"
      >
        <View
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: `${accentColor}18` }}
        />

        <View className="gap-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />

                <Text className="text-lg font-extrabold tracking-tight text-slate-900">
                  Room {room.room_name}
                </Text>
              </View>

              <View className="flex-row flex-wrap items-center gap-2">
                <View
                  className="rounded-full border"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    borderColor: `${accentColor}25`,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                  }}
                >
                  <Text className="text-[11px] font-semibold" style={{ color: accentColor }}>
                    {floorLabel(room.floor.floor_number)}
                  </Text>
                </View>

                <Text className="text-xs font-medium text-slate-500">
                  Base rent {formatCurrency(room.base_rent_amount)}
                </Text>
              </View>
            </View>

            <Badge status={badgeStatus} size="sm" />
          </View>

          <View
            className="rounded-2xl border"
            style={{
              backgroundColor: isMaintenance ? '#FFF7ED' : '#F8FAFC',
              borderColor: isMaintenance ? '#FED7AA' : '#E2E8F0',
              padding: 3,
            }}
          >
            {isMaintenance ? (
              <View className="gap-1 px-3 py-2">
                <Text className="text-sm font-semibold text-orange-700">Under maintenance</Text>
                <Text className="text-xs leading-5 text-orange-600">
                  This room is temporarily unavailable for tenant assignment.
                </Text>
              </View>
            ) : isVacant ? (
              <View className="gap-1 px-3 py-2">
                <Text className="text-sm font-semibold text-slate-700">No tenant assigned</Text>
                <Text className="text-xs leading-5 text-slate-500">
                  This room is open and ready for a new lease.
                </Text>
              </View>
            ) : tenant ? (
              <View className="flex-row items-center gap-3">
                <Avatar name={tenant.name} size={40} />

                <View className="min-w-0 flex-1">
                  <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>
                    {tenant.name}
                  </Text>

                  <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={1}>
                    Since {formatDate(room.active_lease!.start_date)}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {!isVacant && (
            <View className="flex-row items-end justify-between gap-3">
              <View
                className="flex-1 rounded-2xl px-4 py-4"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <View>
                  <Text className="text-[11px] font-medium uppercase tracking-[0.8px] text-slate-500">
                    Due this month
                  </Text>

                  <Text className="mt-1 text-base font-extrabold text-slate-900">
                    {formatCurrency(rentAmount)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}
