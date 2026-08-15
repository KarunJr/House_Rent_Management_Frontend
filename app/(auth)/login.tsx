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
import * as SecureStore from 'expo-secure-store';

import { LoginFormData, LoginSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import AuthHeader from '@/components/auth/AuthHeader';
import { toast } from '@/components/toast';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { handleError } from '@/helpers/axios.error';
import { login } from '@/service/auth.service';

import { Fonts } from '@/constants/theme';

export default function Login() {
  const [isSecure, setIsSecure] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data);

      if (result.success && result.token) {
        toast.success(result.message || 'Logged in successfully');
        await SecureStore.setItemAsync('accessToken', result.token);
        router.replace('/(tabs)/explore');
        return;
      }

      if (result.emailVerified === false) {
        toast.warning(result.message || 'Please verify your email');
        router.push({
          pathname: '/(auth)/verifyotp',
          params: {
            email: result.user?.email,
          },
        });
        return;
      }

      toast.error(result.message || 'Invalid credentials');
    } catch (error) {
      const apiError = handleError(error);

      toast.error(apiError.message, {
        title: 'Please try again later',
      });
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
        keyboardDismissMode="interactive"
      >
        <View className="flex-1 justify-center">
          {/* Header Section */}
          <AuthHeader
            imageSource={require('../../assets/images/house-rent-logo.png')}
            heading="Welcome to Rentify"
            subheading="Login to continue"
          />

          {/* Form Section */}
          <View className="mt-6 w-full gap-4">
            {/* Username / Email */}
            <View className="gap-1">
              <Controller
                control={control}
                name="usernameOrEmail"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoFocus
                    className="rounded-[10px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-4 text-base text-black"
                    style={{ fontFamily: Fonts.sans }}
                    autoCorrect={false}
                    placeholder="Username or Email"
                    placeholderTextColor="#8A8A8A"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />

              {errors.usernameOrEmail && (
                <Text className="text-xs text-red-500" style={{ fontFamily: Fonts.sans }}>
                  {errors.usernameOrEmail.message}
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
                      textContentType="password"
                      autoComplete="password"
                      secureTextEntry={isSecure}
                    />
                  )}
                />

                <Pressable
                  className="items-center justify-center px-4"
                  onPress={() => setIsSecure((prev) => !prev)}
                  hitSlop={100}
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

            {/* Login Button */}
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
                {isSubmitting ? 'Submitting...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Register */}
            <View className="mt-5 flex-row items-center justify-center">
              <Text className="text-sm text-[#666666]" style={{ fontFamily: Fonts.sans }}>
                Don&#39;t have an account?{' '}
              </Text>

              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text
                  className="text-sm font-semibold text-[#007AFF]"
                  style={{ fontFamily: Fonts.sans }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
