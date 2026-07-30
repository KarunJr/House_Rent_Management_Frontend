import AuthHeader from '@/components/auth/AuthHeader';
import { authStyles as styles } from '@/styles/auth.styles';
import { LoginFormData, LoginSchema } from '@/validation/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Login() {
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
    console.log('Valid login payload:', data);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
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
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputbox}
                    autoCorrect={false}
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    textContentType="password"
                    autoComplete="password"
                    secureTextEntry
                  />
                )}
              />
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
