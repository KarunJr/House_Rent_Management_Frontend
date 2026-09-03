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
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Fonts } from '@/constants/theme';
import type { Floor, Room, RoomStatus } from '@/features/home/home.types';

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
  onSaved: () => void;
  room?: Room;
}

export default function AddRoomScreen({ floors, onBack, onSaved, room }: AddRoomScreenProps) {
  const isEditing = Boolean(room);
  const isOccupied = room?.status === 'OCCUPIED';
  const formDefaults = {
    roomName: room?.room_name ?? '',
    floorId: room?.floor_id ?? floors[0]?.id ?? '',
    baseRentAmount: room?.base_rent_amount ?? '',
    status: room?.status ?? 'AVAILABLE',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddRoomFormInput, unknown, AddRoomFormData>({
    resolver: zodResolver(AddRoomSchema),
    defaultValues: {
      ...formDefaults,
    },
  });

  const selectedStatus = watch('status');
  const selectedFloorId = watch('floorId');

  const onSubmit = async (data: AddRoomFormData) => {
    toast.success(`Room ${data.roomName.trim().toUpperCase()} is ready to save.`, {
      title: isEditing ? 'Room updated' : 'Room created',
    });
    console.log('Room form data', data);
    onSaved();
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
          <ScreenHeader title={isEditing ? 'Edit Room' : 'Add Room'} onBack={onBack} />

          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-slate-900">
              {isEditing ? `Update Room ${room?.room_name}` : 'Create a new room'}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              {isEditing
                ? 'Keep the room details accurate without affecting its rental history.'
                : 'Add the room number, pick its floor, and define the starting rent.'}
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
              <Text className="text-sm font-semibold text-slate-700">Room Status</Text>
              {isOccupied ? (
                <View className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                  <View className="flex-row items-start gap-3">
                    <Ionicons name="key-outline" size={20} color="#B45309" />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-amber-900">Occupied by an active lease</Text>
                      <Text className="mt-1 text-xs leading-5 text-amber-800">
                        Use End Lease when the tenant leaves. That action will make this room available.
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
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
                            style={{ borderColor: isSelected ? '#0D1F3C' : '#E2E8F0' }}
                          >
                            <View className="flex-row items-center justify-between">
                              <View>
                                <Text className="text-sm font-bold text-slate-900">{option.label}</Text>
                                <Text className="mt-1 text-xs leading-5 text-slate-500">{option.helper}</Text>
                              </View>
                              <View
                                className="h-5 w-5 items-center justify-center rounded-full border-2"
                                style={{
                                  borderColor: isSelected ? '#0D1F3C' : '#CBD5E1',
                                  backgroundColor: isSelected ? '#0D1F3C' : '#FFFFFF',
                                }}
                              >
                                {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                              </View>
                            </View>
                          </Pressable>
                        )}
                      />
                    );
                  })}
                </View>
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
              <Text className="text-base font-bold text-white">
                {isEditing ? 'Save Changes' : 'Save Room'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
