import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CalendarMode = 'AD' | 'BS';

interface DatePreferenceState {
  calendarMode: CalendarMode;
  setCalendarMode: (mode: CalendarMode) => void;
}

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const useDatePreferenceStore = create<DatePreferenceState>()(
  persist(
    (set) => ({
      calendarMode: 'AD',
      setCalendarMode: (mode) => set({ calendarMode: mode }),
    }),
    {
      name: 'date-preference',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
