import { Ionicons } from '@expo/vector-icons';
import { BikramDatePicker } from '@inicrea/bikram-sambat-react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { toast } from '@/components/toast';
import { Fonts } from '@/constants/theme';
import type { RoomWithDetails, Tenant } from '@/features/home/home.types';
import { formatCanonicalDateSummary, pickerValueFromCanonicalDate, canonicalDateFromPicker } from '@/features/settings/date.utils';
import { useDatePreferenceStore } from '@/features/settings/date-preference.store';

import { CreateLeaseFormData, CreateLeaseFormInput, CreateLeaseSchema } from '../lease.validation';

const floorLabel = (floorNumber: number) => {
  const lastTwoDigits = floorNumber % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${floorNumber}th Floor`;
  }

  switch (floorNumber % 10) {
    case 1:
      return `${floorNumber}st Floor`;
    case 2:
      return `${floorNumber}nd Floor`;
    case 3:
      return `${floorNumber}rd Floor`;
    default:
      return `${floorNumber}th Floor`;
  }
};

interface CreateLeaseScreenProps {
  rooms: RoomWithDetails[];
  tenants: Tenant[];
  initialRoomId?: number;
  onBack: () => void;
  onCreated: () => void;
}

export default function CreateLeaseScreen({
  rooms,
  tenants,
  initialRoomId,
  onBack,
  onCreated,
}: CreateLeaseScreenProps) {
  const defaultRoom = rooms.find((room) => room.id === initialRoomId) ?? rooms[0];
  const today = new Date().toISOString().slice(0, 10);
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeaseFormInput, unknown, CreateLeaseFormData>({
    resolver: zodResolver(CreateLeaseSchema),
    defaultValues: {
      roomId: defaultRoom?.id ?? '',
      tenantId: '',
      startDate: today,
      monthlyRent: defaultRoom?.base_rent_amount ?? '',
    },
  });

  const selectedRoomId = watch('roomId');
  const selectedTenantId = watch('tenantId');
  const selectedStartDate = watch('startDate');

  const selectedRoom = rooms.find((room) => room.id === Number(selectedRoomId));
  const resolvedDates = useMemo(
    () => formatCanonicalDateSummary(selectedStartDate),
    [selectedStartDate],
  );

  const onSubmit = async (data: CreateLeaseFormData) => {
    const chosenRoom = rooms.find((room) => room.id === data.roomId);
    const chosenTenant = tenants.find((tenant) => tenant.id === data.tenantId);

    toast.success(
      `${chosenTenant?.name ?? 'Tenant'} is ready for Room ${chosenRoom?.room_name ?? data.roomId}.`,
      {
        title: 'Lease created',
      },
    );
    reset({
      roomId: defaultRoom?.id ?? '',
      tenantId: '',
      startDate: today,
      monthlyRent: defaultRoom?.base_rent_amount ?? '',
    });
    onCreated();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <Text className="text-lg font-extrabold text-slate-900">Create Lease</Text>
            <View className="w-11" />
          </View>

          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-slate-900">
              Assign tenant to room
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Choose an available room, select the tenant, and set the starting rent details.
            </Text>
          </View>

          <View className="gap-5">
            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Available Room</Text>
              <View className="gap-3">
                {rooms.map((room) => {
                  const isSelected = Number(selectedRoomId) === room.id;

                  return (
                    <Controller
                      key={room.id}
                      control={control}
                      name="roomId"
                      render={({ field: { onChange } }) => (
                        <Pressable
                          onPress={() => {
                            onChange(room.id);
                            setValue('monthlyRent', room.base_rent_amount, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="rounded-2xl border bg-white px-4 py-3.5"
                          style={{
                            borderColor: isSelected ? '#0D1F3C' : '#E2E8F0',
                            backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                          }}
                        >
                          <View className="flex-row items-center justify-between gap-3">
                            <View className="min-w-0 flex-1">
                              <Text className="text-base font-extrabold text-slate-900">
                                Room {room.room_name}
                              </Text>
                              <Text className="mt-1 text-xs leading-5 text-slate-500">
                                {floorLabel(room.floor.floor_number)} • Base rent रु{' '}
                                {room.base_rent_amount.toLocaleString('en-IN')}
                              </Text>
                            </View>

                            <View
                              className="rounded-full px-3 py-1"
                              style={{
                                backgroundColor: isSelected ? '#DBEAFE' : '#FEF3C7',
                              }}
                            >
                              <Text
                                className="text-[11px] font-bold"
                                style={{ color: isSelected ? '#1D4ED8' : '#B45309' }}
                              >
                                {isSelected ? 'Selected' : 'Available'}
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      )}
                    />
                  );
                })}
              </View>
              {errors.roomId && (
                <Text className="text-xs text-red-500">{errors.roomId.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Tenant</Text>
              <View className="gap-3">
                {tenants.map((tenant) => {
                  const isSelected = Number(selectedTenantId) === tenant.id;

                  return (
                    <Controller
                      key={tenant.id}
                      control={control}
                      name="tenantId"
                      render={({ field: { onChange } }) => (
                        <Pressable
                          onPress={() => onChange(tenant.id)}
                          className="rounded-2xl border bg-white px-4 py-3.5"
                          style={{
                            borderColor: isSelected ? '#14B8A6' : '#E2E8F0',
                            backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
                          }}
                        >
                          <View className="flex-row items-center justify-between gap-3">
                            <View className="min-w-0 flex-1">
                              <Text className="text-base font-extrabold text-slate-900">
                                {tenant.name}
                              </Text>
                              <Text className="mt-1 text-xs leading-5 text-slate-500">
                                {tenant.phone}
                                {tenant.email ? ` • ${tenant.email}` : ''}
                              </Text>
                            </View>

                            {isSelected && (
                              <View className="h-6 w-6 items-center justify-center rounded-full bg-[#14B8A6]">
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                              </View>
                            )}
                          </View>
                        </Pressable>
                      )}
                    />
                  );
                })}
              </View>
              {errors.tenantId && (
                <Text className="text-xs text-red-500">{errors.tenantId.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Start Date</Text>
              <Text className="text-xs leading-5 text-slate-500">
                Calendar mode follows owner preference: {calendarMode}
              </Text>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <BikramDatePicker
                    value={pickerValueFromCanonicalDate(value, calendarMode)}
                    onChange={(nextValue, detail) => {
                      onChange(
                        canonicalDateFromPicker({
                          value: nextValue,
                          mode: calendarMode,
                          adFromDetail: detail.ad,
                        }),
                      );
                    }}
                    valueFormat={calendarMode}
                    locale={calendarMode === 'BS' ? 'ne' : 'en'}
                    format="YYYY MMMM DD"
                    placeholder="Select lease start date"
                    colorScheme="light"
                    style={{
                      width: '100%',
                    }}
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
                )}
              />
              {errors.startDate && (
                <Text className="text-xs text-red-500">{errors.startDate.message}</Text>
              )}
              {resolvedDates.ad || resolvedDates.bs ? (
                <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-slate-400">
                    Stored And Displayed
                  </Text>
                  <Text className="mt-2 text-sm font-semibold text-slate-800">
                    Saved to API/DB: {resolvedDates.ad || '-'}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-slate-800">
                    Shown in app: {calendarMode === 'BS' ? resolvedDates.bs || '-' : resolvedDates.ad || '-'}
                  </Text>
                  <Text className="mt-1 text-xs leading-5 text-slate-500">
                    We always keep the canonical value in AD, then render it in the owner&apos;s preferred calendar.
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Monthly Rent (NPR)</Text>
              <Controller
                control={control}
                name="monthlyRent"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder={selectedRoom ? String(selectedRoom.base_rent_amount) : '18000'}
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.monthlyRent && (
                <Text className="text-xs text-red-500">{errors.monthlyRent.message}</Text>
              )}
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
              disabled={isSubmitting}
              className="flex-1 items-center rounded-2xl bg-[#14B8A6] px-4 py-4"
              style={{
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Text className="text-base font-bold text-white">Save Lease</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
