import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { toast } from '@/components/toast';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuthStore } from '@/features/auth/auth.store';
import { useDatePreferenceStore, type CalendarMode } from '@/features/settings/date-preference.store';

const calendarOptions: CalendarMode[] = ['AD', 'BS'];

export default function SettingsScreen() {
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);
  const setCalendarMode = useDatePreferenceStore((state) => state.setCalendarMode);
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      toast.error('Unable to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Settings" onBack={() => router.navigate('/(tabs)/home')} />

        <View className="gap-3">
          <View className="flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <View>
              <Text className="text-sm font-bold text-slate-900">Date format</Text>
              <Text className="mt-1 text-xs text-slate-500">Dates across the app</Text>
            </View>

            <View accessibilityRole="radiogroup" accessibilityLabel="Date format" className="flex-row gap-1">
              {calendarOptions.map((mode) => {
                const selected = calendarMode === mode;

                return (
                  <Pressable
                    key={mode}
                    accessibilityRole="radio"
                    accessibilityLabel={mode}
                    accessibilityState={{ checked: selected }}
                    onPress={() => setCalendarMode(mode)}
                    className="min-h-11 flex-row items-center gap-2 rounded-xl px-2 active:bg-slate-100"
                  >
                    <View
                      className="h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{ borderColor: selected ? '#14B8A6' : '#CBD5E1' }}
                    >
                      {selected && <View className="h-2.5 w-2.5 rounded-full bg-[#14B8A6]" />}
                    </View>
                    <Text className="text-sm font-semibold text-slate-800">{mode}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mt-auto pt-8">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
            disabled={isLoggingOut}
            onPress={handleLogout}
            className="min-h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 active:bg-red-50"
            style={{ opacity: isLoggingOut ? 0.5 : 1 }}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text className="text-sm font-bold text-red-600">{isLoggingOut ? 'Logging out…' : 'Logout'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
