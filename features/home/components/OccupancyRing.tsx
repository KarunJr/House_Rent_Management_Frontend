import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface OccupancyRingProps {
  /** 0–100 */
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

/**
 * Donut gauge showing occupancy rate. This is the app's signature motif —
 * it reappears in miniature next to each room row (see RoomListItem) so the
 * same shape means "status" everywhere a landlord looks.
 */
export function OccupancyRing({ percentage, size = 84, strokeWidth = 9 }: OccupancyRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#FBF6F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-display text-lg text-white">{Math.round(clamped)}%</Text>
      </View>
    </View>
  );
}
