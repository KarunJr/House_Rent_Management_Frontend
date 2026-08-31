import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { invoiceStatusToBadge, type RoomWithDetails } from '../home.types';
import { Avatar } from './ui/Avatar';
import Badge from './ui/StatusBadge';

interface RoomCardProps {
  room: RoomWithDetails;
  onPress: (id: number) => void;
}

type StatusCopy = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  borderColor: string;
  iconBackground: string;
  titleColor: string;
  descriptionColor: string;
};

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

const formatCurrency = (amount: number) => `रू ${amount.toLocaleString('en-IN')}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

const getStatusCopy = (room: RoomWithDetails): StatusCopy => {
  if (room.status === 'MAINTENANCE') {
    return {
      title: 'Under maintenance',
      description: 'This room is temporarily unavailable for tenant assignment.',
      icon: 'construct-outline',
      backgroundColor: '#FFF7ED',
      borderColor: '#FED7AA',
      iconBackground: '#FFEDD5',
      titleColor: '#C2410C',
      descriptionColor: '#9A3412',
    };
  }

  if (room.status === 'AVAILABLE' || room.active_lease === null) {
    return {
      title: 'Ready for lease',
      description: 'No tenant assigned yet. Open this room to create a new lease.',
      icon: 'bed-outline',
      backgroundColor: '#FFFBEB',
      borderColor: '#FDE68A',
      iconBackground: '#FEF3C7',
      titleColor: '#B45309',
      descriptionColor: '#92400E',
    };
  }

  return {
    title: room.tenant?.name ?? 'Current tenant',
    description: `Tenant since ${formatDate(room.active_lease!.start_date)}`,
    icon: 'person-outline',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    iconBackground: '#E2E8F0',
    titleColor: '#0F172A',
    descriptionColor: '#64748B',
  };
};

export default function RoomCard({ room, onPress }: RoomCardProps) {
  const accentColor = getAccentColor(room.status);
  const isVacant = room.status === 'AVAILABLE' || room.active_lease === null;
  const isMaintenance = room.status === 'MAINTENANCE';
  const tenant = room.tenant;
  const rentAmount = room.active_lease?.monthly_rent ?? room.base_rent_amount;
  const statusCopy = getStatusCopy(room);
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
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
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

        <View className="gap-3.5">
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
                  className="rounded-full border px-2.5 py-1"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    borderColor: `${accentColor}25`,
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
            className="rounded-[22px] border px-3.5 py-3"
            style={{
              backgroundColor: statusCopy.backgroundColor,
              borderColor: statusCopy.borderColor,
            }}
          >
            {tenant && !isVacant && !isMaintenance ? (
              <View className="flex-row items-center gap-3">
                <Avatar name={tenant.name} size={42} />

                <View className="min-w-0 flex-1 gap-1">
                  <Text
                    className="text-sm font-extrabold tracking-tight"
                    numberOfLines={1}
                    style={{ color: statusCopy.titleColor }}
                  >
                    {statusCopy.title}
                  </Text>

                  <Text
                    className="text-xs leading-5"
                    numberOfLines={1}
                    style={{ color: statusCopy.descriptionColor }}
                  >
                    {statusCopy.description}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            ) : (
              <View className="flex-row items-center gap-3">
                <View
                  className="h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: statusCopy.iconBackground }}
                >
                  <Ionicons name={statusCopy.icon} size={20} color={statusCopy.titleColor} />
                </View>

                <View className="min-w-0 flex-1 gap-1">
                  <Text
                    className="text-sm font-extrabold tracking-tight"
                    style={{ color: statusCopy.titleColor }}
                  >
                    {statusCopy.title}
                  </Text>

                  <Text
                    className="text-xs leading-5"
                    style={{ color: statusCopy.descriptionColor }}
                  >
                    {statusCopy.description}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={statusCopy.titleColor} />
              </View>
            )}
          </View>

          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-[22px] px-4 py-3.5"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <Text className="text-[11px] font-medium uppercase tracking-[0.8px] text-slate-500">
                {isVacant ? 'Base Rent' : 'Due This Month'}
              </Text>

              <Text className="mt-1 text-base font-extrabold text-slate-900">
                {formatCurrency(rentAmount)}
              </Text>
            </View>

            <View className="min-w-[88px] rounded-[22px] bg-slate-50 px-3 py-3.5">
              <Text className="text-[11px] font-medium uppercase tracking-[0.8px] text-slate-500">
                Status
              </Text>

              <Text className="mt-1 text-sm font-extrabold" style={{ color: accentColor }}>
                {isMaintenance ? 'Hold' : isVacant ? 'Open' : 'Active'}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
