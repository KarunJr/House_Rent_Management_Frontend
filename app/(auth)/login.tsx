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

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, LoginSchema } from '@/validation/auth.validation';

import AuthHeader from '@/components/auth/AuthHeader';
import { toast } from '@/components/toast';
import { authStyles as styles } from '@/styles/auth.styles';

import { login } from '@/service/auth.service';
import { handleError } from '@/helpers/axios.error';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Login() {
  const [isSecure, setIsSecure] = useState<boolean>(false);
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header Section */}
          <AuthHeader
            imageSource={require('../../assets/images/house-rent-logo.png')}
            heading="Welcome to Rentify"
            subheading="Login to continue"
          />

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="usernameOrEmail"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoFocus
                    style={styles.inputbox}
                    autoCorrect={false}
                    placeholder="Username or Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.usernameOrEmail && (
                <Text style={styles.errorText}>{errors.usernameOrEmail.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.inputboxPassword}
                      autoCorrect={false}
                      placeholder="Password"
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
                  style={styles.eyeButton}
                  onPress={() => setIsSecure((prev) => !prev)}
                  hitSlop={100}
                >
                  <IconSymbol name={isSecure ? 'eye.slash' : 'eye'} size={20} color="#666" />
                </Pressable>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Login'}</Text>
            </TouchableOpacity>

            <View style={styles.registerView}>
              <Text style={styles.registerText}>Don&#39;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
