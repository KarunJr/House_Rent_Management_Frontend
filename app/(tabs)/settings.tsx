import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDatePreferenceStore, type CalendarMode } from '@/features/settings/date-preference.store';

const calendarOptions: { mode: CalendarMode; title: string; example: string; description: string }[] = [
  {
    mode: 'AD',
    title: 'English date (AD)',
    example: '2026 January 15',
    description: 'Use the Gregorian calendar throughout the app.',
  },
  {
    mode: 'BS',
    title: 'Nepali date (BS)',
    example: '2082 Magh 01',
    description: 'Use the Bikram Sambat calendar throughout the app.',
  },
];

export default function SettingsScreen() {
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);
  const setCalendarMode = useDatePreferenceStore((state) => state.setCalendarMode);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top']}>
      <View className="px-5 pt-5">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF7F3]">
          <Ionicons name="settings-outline" size={23} color="#0F766E" />
        </View>
        <Text className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">Settings</Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500">
          Set the calendar every date in your rental account should use.
        </Text>
      </View>

      <View className="mt-8 px-5">
        <Text className="text-sm font-bold text-slate-800">Date calendar</Text>
        <Text className="mt-1 text-xs leading-5 text-slate-500">
          You can change this anytime. Existing records remain the same day.
        </Text>

        <View className="mt-4 gap-3">
          {calendarOptions.map((option) => {
            const selected = calendarMode === option.mode;

            return (
              <Pressable
                key={option.mode}
                onPress={() => setCalendarMode(option.mode)}
                className="rounded-2xl border bg-white px-4 py-4"
                style={{
                  borderColor: selected ? '#14B8A6' : '#E2E8F0',
                  backgroundColor: selected ? '#F0FDFA' : '#FFFFFF',
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: selected ? '#CCFBF1' : '#F1F5F9' }}
                  >
                    <Ionicons name="calendar-outline" size={19} color={selected ? '#0F766E' : '#64748B'} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-base font-bold text-slate-900">{option.title}</Text>
                    <Text className="mt-1 text-sm font-semibold text-teal-700">{option.example}</Text>
                    <Text className="mt-1 text-xs leading-5 text-slate-500">{option.description}</Text>
                  </View>
                  <View
                    className="h-6 w-6 items-center justify-center rounded-full border-2"
                    style={{ borderColor: selected ? '#14B8A6' : '#CBD5E1' }}
                  >
                    {selected && <View className="h-3 w-3 rounded-full bg-[#14B8A6]" />}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
