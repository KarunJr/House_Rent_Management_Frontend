import { useAuthStore } from '@/features/auth/auth.store';
import '../global.css';

import { ToastProvider } from '@/components/toast';
import { LoadingState } from '@/components/ui/LoadingState';
import { router, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  // const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    console.log('Segments from another one:', segments);
    console.log('IsAuthenticated', isAuthenticated);
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <LoadingState />;
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
