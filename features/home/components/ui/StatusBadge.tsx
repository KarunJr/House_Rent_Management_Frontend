import { Text, View } from 'react-native';
export type BadgeStatus =
  'vacant' | 'available' | 'maintenance' | 'paid' | 'pending' | 'partial' | 'overdue' | 'cancelled';

interface BadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

const badgeConfig: Record<
  BadgeStatus,
  {
    label: string;
    background: string;
    text: string;
  }
> = {
  vacant: {
    label: 'Vacant',
    background: '#FFFBEB',
    text: '#B45309',
  },

  available: {
    label: 'Available',
    background: '#FFFBEB',
    text: '#B45309',
  },

  maintenance: {
    label: 'Maintenance',
    background: '#FFF7ED',
    text: '#C2410C',
  },

  paid: {
    label: 'Paid',
    background: '#F0FDF4',
    text: '#15803D',
  },

  pending: {
    label: 'Pending',
    background: '#FFFBEB',
    text: '#B45309',
  },

  partial: {
    label: 'Partial',
    background: '#EFF6FF',
    text: '#1D4ED8',
  },

  overdue: {
    label: 'Overdue',
    background: '#FEF2F2',
    text: '#DC2626',
  },

  cancelled: {
    label: 'Cancelled',
    background: '#F3F4F6',
    text: '#4B5563',
  },
};

export default function Badge({ status, size = 'md' }: BadgeProps) {
  const config = badgeConfig[status];
  const isSmall = size === 'sm';

  return (
    <View
      className="justify-center items-center rounded-xl"
      style={{ backgroundColor: config.background }}
    >
      <Text
        className={`font-bold ${isSmall ? 'text-[11px]' : 'text-xs'} px-4`}
        style={{
          color: config.text,
          lineHeight: isSmall ? 14 : 16,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
