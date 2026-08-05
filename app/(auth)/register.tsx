import AuthHeader from '@/components/auth/AuthHeader';
import { toast } from '@/components/toast';
import { handleError } from '@/helpers/axios.error';
import { register } from '@/service/auth.service';
import { authStyles as styles } from '@/styles/auth.styles';
import { RegisterFormData, RegisterSchema } from '@/validation/auth.validation';
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

export default function Register() {
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.container}>
          {/* Header Section */}
          <AuthHeader
            imageSource={require('../../assets/images/house-rent-logo.png')}
            heading="Create an Account"
            subheading="Sign up to get started with Rentify."
          />

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputbox}
                    autoCorrect={false}
                    placeholder="Full Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputbox}
                    autoCorrect={false}
                    placeholder="Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputbox}
                    autoCorrect={false}
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            {/* Password Field */}
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
                    textContentType="newPassword"
                    autoComplete="password-new"
                    secureTextEntry
                  />
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputbox}
                    placeholder="Phone Number"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Register'}</Text>
            </TouchableOpacity>

            <View style={styles.registerView}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/verifyotp')}>
                <Text style={styles.registerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
