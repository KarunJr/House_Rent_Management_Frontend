import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from './ui/Avatar';

interface HomeHeaderProps {
  name: string;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

export function HomeHeader({
  name,
  avatarUrl,
  hasUnreadNotifications,
  onPressAvatar,
  onPressNotifications,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable onPress={onPressAvatar} className="flex-row items-center">
        <Avatar uri={avatarUrl} name={name} size={46} />
        <View className="ml-3">
          <Text className="font-display-medium text-xl text-ink">Hello, {name}</Text>
          <Text className="font-body text-sm text-inkMuted">{getTodayLabel()}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onPressNotifications}
        hitSlop={10}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface"
        style={{
          shadowColor: '#2A241D',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <Text className="text-lg">🔔</Text>
        {hasUnreadNotifications && (
          <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-surface bg-clay" />
        )}
      </Pressable>
    </View>
  );
}
