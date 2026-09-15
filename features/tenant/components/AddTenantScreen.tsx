import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
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
import { handleError } from '@/helpers/axios.error';
import type { TenantDetails } from '../tenant.types';
import { useTenantStore } from '../tenant.store';

import { AddTenantFormData, AddTenantFormInput, AddTenantSchema } from '../tenant.validation';

interface AddTenantScreenProps {
  onBack: () => void;
  onSaved: () => void;
  tenant?: TenantDetails;
  onViewTenants?: () => void;
}

export default function AddTenantScreen({
  onBack,
  onSaved,
  tenant,
  onViewTenants,
}: AddTenantScreenProps) {
  const isEditing = Boolean(tenant);
  const addTenant = useTenantStore((state) => state.addTenant);
  const editTenant = useTenantStore((state) => state.editTenant);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddTenantFormInput, unknown, AddTenantFormData>({
    resolver: zodResolver(AddTenantSchema),
    defaultValues: {
      name: tenant?.name ?? '',
      phone: tenant?.phone ?? '',
      email: tenant?.email ?? '',
    },
  });

  const saveInProgress = useRef(false);
  const onSubmit = async (data: AddTenantFormData) => {
    if (saveInProgress.current) return;
    saveInProgress.current = true;
    try {
      const savedTenant = tenant ? await editTenant(tenant.id, data) : await addTenant(data);
      toast.success(`${savedTenant.name} has been ${isEditing ? 'updated' : 'created'}.`, {
        title: isEditing ? 'Tenant updated' : 'Tenant created',
      });
      onSaved();
    } catch (error) {
      const fieldErrors = isAxiosError(error) ? error.response?.data?.errors : undefined;
      let hasFieldError = false;
      if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) {
        for (const [key, messages] of Object.entries(fieldErrors)) {
          const field = key.split('.').pop()?.toLowerCase();
          if (
            (field === 'name' || field === 'phone' || field === 'email') &&
            Array.isArray(messages) &&
            typeof messages[0] === 'string'
          ) {
            setError(field, { type: 'server', message: messages[0] });
            hasFieldError = true;
          }
        }
      }
      toast.error(
        hasFieldError ? 'Please check the highlighted fields.' : handleError(error).message,
        {
          title: 'Tenant not saved',
        },
      );
    } finally {
      saveInProgress.current = false;
    }
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
          <ScreenHeader
            title={isEditing ? 'Edit Tenant' : 'Add Tenant'}
            onBack={onBack}
            right={
              !isEditing && onViewTenants ? (
                <Pressable
                  onPress={onViewTenants}
                  className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
                >
                  <Ionicons name="people-outline" size={20} color="#0F172A" />
                </Pressable>
              ) : undefined
            }
          />

          <View className="mb-6">
            <Text className="text-3xl font-extrabold tracking-tight text-slate-900">
              {isEditing ? `Update ${tenant?.name}` : 'Create a new tenant'}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              {isEditing
                ? 'Keep the tenant contact details accurate without changing their lease history.'
                : 'Save the tenant details first, then you can connect them to a room through a lease.'}
            </Text>
          </View>

          <View className="gap-5">
            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Tenant Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="Full name"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name && <Text className="text-xs text-red-500">{errors.name.message}</Text>}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Phone Number</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="98XXXXXXXX"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.phone && <Text className="text-xs text-red-500">{errors.phone.message}</Text>}
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-semibold text-slate-700">Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="Optional email"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email && <Text className="text-xs text-red-500">{errors.email.message}</Text>}
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
                {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Save Tenant'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
