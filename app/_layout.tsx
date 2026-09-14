import { useAuthStore } from '@/features/auth/auth.store';
import '../global.css';

import { ToastProvider } from '@/components/toast';
import { LoadingState } from '@/components/ui/LoadingState';
import { router, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.authError);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading || authError) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, authError, segments]);

  if (isLoading) {
    return <LoadingState />;
  }
  if (authError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-6">
        <Text accessibilityRole="alert" className="text-center text-sm leading-6 text-slate-500">
          {authError}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={checkAuth}
          className="mt-6 rounded-2xl bg-teal-700 px-5 py-3"
        >
          <Text className="text-sm font-bold text-white">Try again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lease/create" options={{ headerShown: false }} />
        <Stack.Screen name="room/add" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]/index" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]/edit" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]/end-lease" options={{ headerShown: false }} />
        <Stack.Screen name="tenant/add" options={{ headerShown: false }} />
        <Stack.Screen name="tenant/index" options={{ headerShown: false }} />
        <Stack.Screen name="tenant/[id]/index" options={{ headerShown: false }} />
        <Stack.Screen name="tenant/[id]/edit" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: true, presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </ToastProvider>
  );
}
