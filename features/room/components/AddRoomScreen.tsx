import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
import type { Floor, RoomStatus } from '@/features/home/home.types';

import { AddRoomFormData, AddRoomFormInput, AddRoomSchema } from '../room.validation';

const STATUS_OPTIONS: {
  label: string;
  value: Extract<RoomStatus, 'AVAILABLE' | 'MAINTENANCE'>;
  helper: string;
}[] = [
  {
    label: 'Available',
    value: 'AVAILABLE',
    helper: 'Ready for a new tenant',
  },
  {
    label: 'Maintenance',
    value: 'MAINTENANCE',
    helper: 'Temporarily unavailable',
  },
];

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

interface AddRoomScreenProps {
  floors: Floor[];
  onBack: () => void;
  onCreated: () => void;
}

export default function AddRoomScreen({ floors, onBack, onCreated }: AddRoomScreenProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddRoomFormInput, unknown, AddRoomFormData>({
    resolver: zodResolver(AddRoomSchema),
    defaultValues: {
      roomName: '',
      floorId: floors[0]?.id ?? '',
      baseRentAmount: '',
      status: 'AVAILABLE',
    },
  });

  const selectedStatus = watch('status');
  const selectedFloorId = watch('floorId');

  const onSubmit = async (data: AddRoomFormData) => {
    toast.success(`Room ${data.roomName.trim().toUpperCase()} is ready to save.`, {
      title: 'Room created',
    });
    reset({
      roomName: '',
      floorId: floors[0]?.id ?? '',
      baseRentAmount: '',
      status: 'AVAILABLE',
    });
    console.log('Data', data);
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

            <Text className="text-lg font-extrabold text-slate-900">Add Room</Text>
            <View className="w-11" />
          </View>

          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create a new room
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Add the room number, pick its floor, and define the starting rent.
            </Text>
          </View>

          <View className="gap-5">
            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Room Name</Text>
              <Controller
                control={control}
                name="roomName"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="Example: 301"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.roomName && (
                <Text className="text-xs text-red-500">{errors.roomName.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Floor</Text>
              <View className="flex-row flex-wrap gap-3">
                {floors.map((floor) => {
                  const isSelected = selectedFloorId === floor.id;

                  return (
                    <Controller
                      key={floor.id}
                      control={control}
                      name="floorId"
                      render={({ field: { onChange } }) => (
                        <Pressable
                          onPress={() => onChange(floor.id)}
                          className="min-w-[108px] rounded-2xl border px-4 py-3"
                          style={{
                            backgroundColor: isSelected ? '#E8F2FF' : '#FFFFFF',
                            borderColor: isSelected ? '#2563EB' : '#E2E8F0',
                          }}
                        >
                          <Text
                            className="text-sm font-bold"
                            style={{ color: isSelected ? '#1D4ED8' : '#0F172A' }}
                          >
                            {floorLabel(floor.floor_number)}
                          </Text>
                          <Text className="mt-1 text-xs text-slate-500">
                            Floor {floor.floor_number}
                          </Text>
                        </Pressable>
                      )}
                    />
                  );
                })}
              </View>
              {errors.floorId && (
                <Text className="text-xs text-red-500">{errors.floorId.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Base Rent (NPR)</Text>
              <Controller
                control={control}
                name="baseRentAmount"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="18000"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.baseRentAmount && (
                <Text className="text-xs text-red-500">{errors.baseRentAmount.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Initial Status</Text>
              <View className="gap-3">
                {STATUS_OPTIONS.map((option) => {
                  const isSelected = selectedStatus === option.value;

                  return (
                    <Controller
                      key={option.value}
                      control={control}
                      name="status"
                      render={({ field: { onChange } }) => (
                        <Pressable
                          onPress={() => onChange(option.value)}
                          className="rounded-2xl border bg-white px-4 py-3.5"
                          style={{
                            borderColor: isSelected ? '#0D1F3C' : '#E2E8F0',
                          }}
                        >
                          <View className="flex-row items-center justify-between">
                            <View>
                              <Text className="text-sm font-bold text-slate-900">
                                {option.label}
                              </Text>
                              <Text className="mt-1 text-xs leading-5 text-slate-500">
                                {option.helper}
                              </Text>
                            </View>
                            <View
                              className="h-5 w-5 items-center justify-center rounded-full border-2"
                              style={{
                                borderColor: isSelected ? '#0D1F3C' : '#CBD5E1',
                                backgroundColor: isSelected ? '#0D1F3C' : '#FFFFFF',
                              }}
                            >
                              {isSelected && (
                                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                              )}
                            </View>
                          </View>
                        </Pressable>
                      )}
                    />
                  );
                })}
              </View>
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
              <Text className="text-base font-bold text-white">Save Room</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
