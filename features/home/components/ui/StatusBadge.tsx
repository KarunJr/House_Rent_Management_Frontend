import React from 'react';
import { Text, View } from 'react-native';
import type { PaymentStatus, RoomStatus } from '../../types/models';

export type BadgeTone = 'sage' | 'amber' | 'clay' | 'neutral';

const TONE_CLASSES: Record<BadgeTone, { bg: string; dot: string; text: string }> = {
  sage: { bg: 'bg-sage-soft', dot: 'bg-sage', text: 'text-sage-deep' },
  amber: { bg: 'bg-amber-soft', dot: 'bg-amber', text: 'text-amber-deep' },
  clay: { bg: 'bg-clay-soft', dot: 'bg-clay', text: 'text-clay-deep' },
  neutral: { bg: 'bg-surfaceMuted', dot: 'bg-inkFaint', text: 'text-inkMuted' },
};

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}

/** Low-level pill. Prefer the semantic helpers below in screens. */
export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const classes = TONE_CLASSES[tone];
  return (
    <View className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${classes.bg}`}>
      <View className={`mr-1.5 h-1.5 w-1.5 rounded-full ${classes.dot}`} />
      <Text className={`font-body-medium text-xs ${classes.text}`}>{label}</Text>
    </View>
  );
}

const ROOM_STATUS_MAP: Record<RoomStatus, { label: string; tone: BadgeTone }> = {
  occupied: { label: 'Occupied', tone: 'sage' },
  vacant: { label: 'Vacant', tone: 'neutral' },
};

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  paid: { label: 'Paid', tone: 'sage' },
  pending: { label: 'Pending', tone: 'amber' },
  overdue: { label: 'Overdue', tone: 'clay' },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const { label, tone } = ROOM_STATUS_MAP[status];
  return <StatusBadge label={label} tone={tone} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, tone } = PAYMENT_STATUS_MAP[status];
  return <StatusBadge label={label} tone={tone} />;
}
