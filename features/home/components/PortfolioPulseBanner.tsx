import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, shadow } from '../theme/tokens';
import type { PortfolioSummary } from '../types/models';
import { formatCurrency } from '../utils/format';
// import { OccupancyRing } from './OccupancyRing';

interface PortfolioPulseBannerProps {
  summary: PortfolioSummary;
  onPressVacant: () => void;
}

/**
 * The dashboard's hero. Answers the landlord's first question — "is my
 * portfolio healthy right now?" — in one glance, and surfaces the single
 * most useful action (deal with vacant rooms / pending rent) instead of a
 * generic "explore" prompt.
 */
export function PortfolioPulseBanner({ summary, onPressVacant }: PortfolioPulseBannerProps) {
  // const occupancyRate =
  //   summary.totalRooms === 0 ? 0 : (summary.occupiedRooms / summary.totalRooms) * 100;

  const hasVacancy = summary.vacantRooms > 0;

  return (
    <LinearGradient
      colors={[colors.terracotta, colors.terracottaDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: 28, padding: 20 }, shadow.banner]}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="font-body-medium text-xs uppercase tracking-wider text-white/70">
            Portfolio pulse
          </Text>
          <Text className="mt-1 font-display text-2xl text-white">
            {summary.occupiedRooms} of {summary.totalRooms} rooms occupied
          </Text>
          <Text className="mt-1.5 font-body text-sm text-white/85">
            {formatCurrency(summary.monthlyRevenue, summary.currency)} collected this month
          </Text>
        </View>
        {/* <OccupancyRing percentage={occupancyRate} /> */}
      </View>

      {hasVacancy && (
        <Pressable
          onPress={onPressVacant}
          className="mt-5 flex-row items-center justify-between rounded-2xl bg-white/15 px-4 py-3 active:bg-white/25"
        >
          <Text className="font-body-semibold text-sm text-white">
            {summary.vacantRooms} {summary.vacantRooms === 1 ? 'room' : 'rooms'} sitting vacant —
            tap to assign
          </Text>
          <Text className="font-body-semibold text-base text-white">→</Text>
        </Pressable>
      )}
    </LinearGradient>
  );
}
