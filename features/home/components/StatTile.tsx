import React from 'react';
import { Text } from 'react-native';
import { Card } from './ui/Card';

interface StatTileProps {
  label: string;
  value: string;
  tone?: 'ink' | 'sage' | 'clay';
}

const TONE_TEXT: Record<NonNullable<StatTileProps['tone']>, string> = {
  ink: 'text-ink',
  sage: 'text-sage-deep',
  clay: 'text-clay-deep',
};

export function StatTile({ label, value, tone = 'ink' }: StatTileProps) {
  return (
    <Card className="min-w-[132px] px-4 py-3.5" style={{ marginRight: 12 }}>
      <Text className="font-body-medium text-xs text-inkMuted">{label}</Text>
      <Text className={`mt-1 font-display text-xl ${TONE_TEXT[tone]}`}>{value}</Text>
    </Card>
  );
}
