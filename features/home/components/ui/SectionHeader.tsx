import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-end justify-between">
      <Text className="font-display-medium text-lg text-ink">{title}</Text>
      {actionLabel && (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text className="font-body-medium text-sm text-terracotta">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
