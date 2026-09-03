import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { toast } from '@/components/toast';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RoomWithDetails } from '@/features/home/home.types';
import { AppDatePicker } from '@/features/settings/components/AppDatePicker';
import { useDatePreferenceStore } from '@/features/settings/date-preference.store';
import {
  canonicalDateFromDate,
  dateFromCanonical,
  formatCanonicalDateForMode,
} from '@/features/settings/date.utils';

import { EndLeaseFormData, EndLeaseFormInput, EndLeaseSchema } from '../lease.validation';

const formatCurrency = (amount: number) => `रू ${amount.toLocaleString('en-IN')}`;

interface EndLeaseScreenProps {
  room: RoomWithDetails;
  onBack: () => void;
  onEnded: () => void;
}

export default function EndLeaseScreen({ room, onBack, onEnded }: EndLeaseScreenProps) {
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);
  const activeLease = room.active_lease!;
  const today = canonicalDateFromDate(new Date());

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<EndLeaseFormInput, unknown, EndLeaseFormData>({
    resolver: zodResolver(EndLeaseSchema),
    defaultValues: { endDate: today },
  });

  const selectedEndDate = watch('endDate');
  const displayedEndDate = formatCanonicalDateForMode(selectedEndDate, calendarMode);

  const onSubmit = (data: EndLeaseFormData) => {
    const endDate = dateFromCanonical(data.endDate);
    const startDate = dateFromCanonical(activeLease.start_date);
    const currentDate = dateFromCanonical(today);

    if (!endDate || !startDate || !currentDate) {
      setError('endDate', { message: 'Choose a valid move-out date' });
      return;
    }

    if (endDate < startDate) {
      setError('endDate', { message: 'Move-out date cannot be before the lease start date' });
      return;
    }

    if (endDate > currentDate) {
      setError('endDate', { message: 'Choose today or a past date after the tenant has moved out' });
      return;
    }

    Alert.alert(
      'End this lease?',
      `${room.tenant?.name ?? 'This tenant'} will be removed from Room ${room.room_name}, and the room will become available.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Lease',
          style: 'destructive',
          onPress: () => {
            toast.success(`Room ${room.room_name} is ready for a new tenant.`, {
              title: 'Lease ended',
            });
            onEnded();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="End Lease" onBack={onBack} />

          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-slate-900">Confirm move-out</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              End the active lease only after the tenant has moved out.
            </Text>
          </View>

          <View className="gap-5">
            <View className="rounded-3xl bg-[#0D1F3C] p-5">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-[1.2px] text-slate-300">Active lease</Text>
                  <Text className="mt-2 text-2xl font-extrabold text-white">Room {room.room_name}</Text>
                  <Text className="mt-1 text-sm text-slate-300">{room.tenant?.name ?? 'Current tenant'}</Text>
                </View>
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Ionicons name="key-outline" size={21} color="#5EEAD4" />
                </View>
              </View>

              <View className="mt-5 flex-row border-t border-white/10 pt-4">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-slate-400">Started</Text>
                  <Text className="mt-1 text-sm font-bold text-white">
                    {formatCanonicalDateForMode(activeLease.start_date, calendarMode)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-slate-400">Monthly rent</Text>
                  <Text className="mt-1 text-sm font-bold text-white">{formatCurrency(activeLease.monthly_rent)}</Text>
                </View>
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Move-out Date</Text>
              <Text className="text-xs leading-5 text-slate-500">
                Choose today or an earlier date. Calendar preference: {calendarMode}.
              </Text>
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <AppDatePicker
                    value={value}
                    mode={calendarMode}
                    onChange={onChange}
                    placeholder="Select move-out date"
                  />
                )}
              />
              {errors.endDate && <Text className="text-xs text-red-500">{errors.endDate.message}</Text>}
              {displayedEndDate ? (
                <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <Text className="text-sm font-semibold text-slate-800">Move-out: {displayedEndDate}</Text>
                  <Text className="mt-1 text-xs leading-5 text-slate-500">
                    Once confirmed, Room {room.room_name} will be available for a new lease.
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <Ionicons name="information-circle-outline" size={20} color="#B45309" />
              <Text className="flex-1 text-xs leading-5 text-amber-900">
                Existing payments and invoice history will remain unchanged. Only future billing stops.
              </Text>
            </View>
          </View>

          <View className="mt-8 flex-row gap-3">
            <Pressable
              onPress={onBack}
              className="flex-1 items-center rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <Text className="text-base font-semibold text-slate-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#DC2626] px-4 py-4"
            >
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
              <Text className="text-base font-bold text-white">End Lease</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
