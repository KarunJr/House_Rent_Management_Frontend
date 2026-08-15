import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import AuthHeader from '@/components/auth/AuthHeader';
import { toast } from '@/components/toast';
import { handleError } from '@/helpers/axios.error';
import { register } from '@/service/auth.service';
import { RegisterFormData, RegisterSchema } from '@/validation/auth.validation';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function Register() {
  const [isSecure, setIsSecure] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Valid login payload:', data);

      const result = await register(data);

      console.log(result);
      console.log(result.createdUser);

      if (result.emailSent) {
        toast.info('Check your inbox to continue.', {
          title: 'Verification Email Sent!',
        });

        router.push({
          pathname: '/(auth)/verifyotp',
          params: {
            email: result.createdUser.email,
          },
        });
      } else {
        toast.info(result.message);
        router.push('/(auth)/login');
      }
    } catch (error) {
      const apiError = handleError(error);

      toast.error(apiError.message, {
        title: 'Please try again later',
      });

      console.log(apiError);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 py-10"
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center">
          {/* Header Section */}
          <AuthHeader
            imageSource={require('../../assets/images/house-rent-logo.png')}
            heading="Create an Account"
            subheading="Sign up to get started with Rentify."
          />

          {/* Form Section */}
          <View className="mt-6 w-full gap-4">
            {/* Name */}
            <View className="gap-1">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-base text-black"
                    style={{ fontFamily: Fonts.sans }}
                    autoCorrect={false}
                    placeholder="Full Name"
                    placeholderTextColor="#8A8A8A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />

              {errors.name && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Username */}
            <View className="gap-1">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-base text-black"
                    style={{ fontFamily: Fonts.sans }}
                    autoCorrect={false}
                    placeholder="Username"
                    placeholderTextColor="#8A8A8A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />

              {errors.username && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.username.message}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="gap-1">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-base text-black"
                    style={{ fontFamily: Fonts.sans }}
                    autoCorrect={false}
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    placeholder="Email"
                    placeholderTextColor="#8A8A8A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />

              {errors.email && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="gap-1">
              <View className="flex-row items-center rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA]">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 px-4 py-4 text-base text-black"
                      style={{ fontFamily: Fonts.sans }}
                      autoCorrect={false}
                      placeholder="Password"
                      placeholderTextColor="#8A8A8A"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      autoComplete="password-new"
                      secureTextEntry={isSecure}
                    />
                  )}
                />

                <Pressable
                  className="items-center justify-center px-4"
                  onPress={() => setIsSecure((prev) => !prev)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
                >
                  <IconSymbol name={isSecure ? 'eye.slash' : 'eye'} size={21} color="#666" />
                </Pressable>
              </View>

              {errors.password && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Phone */}
            <View className="gap-1">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-base text-black"
                    style={{ fontFamily: Fonts.sans }}
                    placeholder="Phone Number"
                    placeholderTextColor="#8A8A8A"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />

              {errors.phone && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.phone.message}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`mt-1 items-center rounded-[10px] bg-[#007AFF] py-4 ${
                isSubmitting ? 'opacity-70' : 'opacity-100'
              }`}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text
                className="text-base font-semibold text-white"
                style={{ fontFamily: Fonts.sans }}
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </Text>
            </TouchableOpacity>

            {/* Login */}
            <View className="mt-5 flex-row items-center justify-center">
              <Text className="text-sm text-[#666666]" style={{ fontFamily: Fonts.sans }}>
                Already have an account?{' '}
              </Text>

              <TouchableOpacity onPress={() => router.push('/(auth)/verifyotp')}>
                <Text
                  className="text-sm font-semibold text-[#007AFF]"
                  style={{ fontFamily: Fonts.sans }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
