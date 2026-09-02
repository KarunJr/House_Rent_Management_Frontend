import { Ionicons } from '@expo/vector-icons';
import { BikramDatePicker } from '@inicrea/bikram-sambat-react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

import type { CalendarMode } from '../date-preference.store';
import {
  canonicalDateFromDate,
  canonicalDateFromPicker,
  dateFromCanonical,
  formatCanonicalDateForMode,
  pickerValueFromCanonicalDate,
} from '../date.utils';

interface AppDatePickerProps {
  value: string;
  mode: CalendarMode;
  onChange: (canonicalAdDate: string) => void;
  placeholder?: string;
}

export function AppDatePicker({
  value,
  mode,
  onChange,
  placeholder = 'Select date',
}: AppDatePickerProps) {
  const [isAdPickerVisible, setIsAdPickerVisible] = useState(false);

  const handleAdChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setIsAdPickerVisible(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(canonicalDateFromDate(selectedDate));
    }
  };

  if (mode === 'BS') {
    return (
      <BikramDatePicker
        value={pickerValueFromCanonicalDate(value, 'BS')}
        onChange={(nextValue, detail) => {
          onChange(canonicalDateFromPicker({ value: nextValue, mode: 'BS', adFromDetail: detail.ad }));
        }}
        valueFormat="BS"
        locale="en"
        format="YYYY MMMM DD"
        placeholder={placeholder}
        colorScheme="light"
        style={{ width: '100%' }}
        theme={{
          accent: '#14B8A6',
          accentContrast: '#FFFFFF',
          background: '#FFFFFF',
          foreground: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          weekend: '#DC2626',
          radius: 16,
          daySize: 40,
          fontFamily: Fonts.sans,
        }}
      />
    );
  }

  return (
    <View>
      <Pressable
        onPress={() => setIsAdPickerVisible((visible) => !visible)}
        className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
      >
        <Text className="text-base font-semibold text-slate-900">
          {formatCanonicalDateForMode(value, 'AD') || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#14B8A6" />
      </Pressable>

      {isAdPickerVisible && (
        <View className={Platform.OS === 'ios' ? 'mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white' : ''}>
          <DateTimePicker
            value={dateFromCanonical(value) ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleAdChange}
          />
        </View>
      )}
    </View>
  );
}
