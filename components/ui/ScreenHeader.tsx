import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <Pressable
        onPress={onBack}
        className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
        style={{
          shadowColor: '#0F172A',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        <Ionicons name="arrow-back" size={20} color="#0F172A" />
      </Pressable>

      <Text className="text-lg font-extrabold text-slate-900">{title}</Text>

      {right ?? <View className="w-11" />}
    </View>
  );
}
