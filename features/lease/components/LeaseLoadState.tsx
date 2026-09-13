import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

interface LeaseLoadStateProps {
  title: string;
  message: string;
  onBack: () => void;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function LeaseLoadState({
  title,
  message,
  onBack,
  onRetry,
  actionLabel,
  onAction,
}: LeaseLoadStateProps) {
  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-6" edges={['top', 'bottom']}>
      <ScreenHeader title={title} onBack={onBack} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-sm leading-6 text-slate-500">{message}</Text>
        {onRetry && (
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            className="mt-6 rounded-2xl bg-teal-700 px-5 py-3"
          >
            <Text className="text-sm font-bold text-white">Try again</Text>
          </Pressable>
        )}
        {onAction && actionLabel && (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            className="mt-6 rounded-2xl bg-teal-700 px-5 py-3"
          >
            <Text className="text-sm font-bold text-white">{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
