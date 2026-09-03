import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface QuickActionCardProps {
  label: string;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: QuickActionTone;
  onPress: () => void;
}
type QuickActionTone = {
  background: string;
  border: string;
  iconBackground: string;
  iconColor: string;
  titleColor: string;
};

export default function QuickActionCard({
  label,
  caption,
  icon,
  tone,
  onPress,
}: QuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[96px] flex-1 rounded-[26px] border px-4 py-3.5 active:scale-[0.99]"
      style={{
        backgroundColor: tone.background,
        borderColor: tone.border,
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
      }}
    >
      <View className="mb-3 flex-row items-start justify-between gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: tone.iconBackground }}
        >
          <Ionicons name={icon} size={18} color={tone.iconColor} />
        </View>

        <Ionicons name="chevron-forward" size={16} color={tone.titleColor} />
      </View>

      <Text className="text-[15px] font-extrabold" style={{ color: tone.titleColor }}>
        {label}
      </Text>
      <Text className="mt-1 text-[11px] leading-4 text-slate-500">{caption}</Text>
    </Pressable>
  );
}
