import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type ActivityIndicatorProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface LoadingStateProps {
  /** Screen fills its parent; section fits a list; inline fits an existing container. */
  variant?: 'screen' | 'section' | 'inline';
  message?: string;
  accessibilityLabel?: string;
  size?: ActivityIndicatorProps['size'];
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Render with your existing isLoading flag; this component does not fetch data. */
export function LoadingState({
  variant = 'screen',
  message,
  accessibilityLabel = message ?? 'Loading',
  size = 'large',
  color = '#0F766E',
  style,
}: LoadingStateProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[styles.container, styles[variant], style]}
    >
      <ActivityIndicator size={size} color={color} accessible={false} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  screen: { flex: 1, backgroundColor: '#F1F5F9', padding: 24 },
  section: { padding: 24 },
  inline: {},
  message: { marginTop: 12, fontSize: 14, color: '#64748B', textAlign: 'center' },
});
