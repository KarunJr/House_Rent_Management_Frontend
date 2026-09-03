import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';

/**
 * Call once from the root layout (app/_layout.tsx):
 *
 *   const fontsLoaded = useAppFonts();
 *   if (!fontsLoaded) return null; // or a <SplashScreen />
 *
 * Requires: npx expo install @expo-google-fonts/inter @expo-google-fonts/sora expo-font
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Sora_600SemiBold,
    Sora_700Bold,
  });
  return loaded;
}
