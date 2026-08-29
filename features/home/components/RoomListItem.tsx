import React from 'react';
import { Text, View } from 'react-native';
import type { Room } from '../types/models';
import { formatCurrency, formatShortDate } from '../utils/format';
import { Avatar } from './ui/Avatar';
import { Card } from './ui/Card';
import { PaymentStatusBadge, RoomStatusBadge } from './ui/StatusBadge';

interface RoomListItemProps {
  room: Room;
  onPress: (room: Room) => void;
}

/**
 * One row = one room. The left accent bar repeats the status color used in
 * the badge, so the eye can scan a long list by color alone before reading
 * any text — the same trick the occupancy ring plays at the banner level.
 */
export function RoomListItem({ room, onPress }: RoomListItemProps) {
  const accentClass = room.status === 'occupied' ? 'bg-sage' : 'bg-inkFaint';

  return (
    <Card onPress={() => onPress(room)} className="mb-3 flex-row overflow-hidden p-0">
      <View className={`w-1.5 ${accentClass}`} />
      <View className="flex-1 flex-row items-center px-4 py-3.5">
        {room.status === 'occupied' && room.tenant ? (
          <Avatar uri={room.tenant.avatarUrl} name={room.tenant.name} size={44} />
        ) : (
          <View className="h-11 w-11 items-center justify-center rounded-full bg-surfaceMuted">
            <Text className="text-lg">🔑</Text>
          </View>
        )}

        <View className="ml-3 flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-body-semibold text-base text-ink" numberOfLines={1}>
              {room.label} · {room.propertyName}
            </Text>
          </View>
          <Text className="mt-0.5 font-body text-xs text-inkMuted">
            {room.floorLabel} · {room.status === 'occupied' ? room.tenant?.name : 'Vacant'}
          </Text>

          <View className="mt-2 flex-row items-center justify-between">
            {room.status === 'occupied' && room.tenant ? (
              <>
                <Text className="font-body-medium text-xs text-inkMuted">
                  Due {formatShortDate(room.tenant.rentDueDate)}
                </Text>
                <PaymentStatusBadge status={room.tenant.paymentStatus} />
              </>
            ) : (
              <>
                <Text className="font-body-medium text-xs text-inkMuted">
                  Asking {formatCurrency(room.monthlyRent)}/mo
                </Text>
                <RoomStatusBadge status={room.status} />
              </>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}
