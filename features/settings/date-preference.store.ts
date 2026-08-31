import { create } from 'zustand';

export type CalendarMode = 'AD' | 'BS';

interface DatePreferenceState {
  calendarMode: CalendarMode;
  setCalendarMode: (mode: CalendarMode) => void;
}

export const useDatePreferenceStore = create<DatePreferenceState>()((set) => ({
  calendarMode: 'AD',
  setCalendarMode: (mode) => set({ calendarMode: mode }),
}));
