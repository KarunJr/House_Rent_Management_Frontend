import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title?: string;
  duration?: number; // ms. Defaults to 3500.
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
}

// -----------------------------------------------------------------------------
// Module-level pub/sub so toasts can be fired from anywhere — inside
// components via the `useToast()` hook, or outside React entirely (e.g. an
// API client / axios interceptor) via the exported `toast` object.
// -----------------------------------------------------------------------------
type Listener = (type: ToastType, message: string, options?: ToastOptions) => void;
let activeListener: Listener | null = null;
let hideListener: (() => void) | null = null;

function emitShow(type: ToastType, message: string, options?: ToastOptions) {
  if (!activeListener) {
    if (__DEV__) {
      console.warn(
        '[Toast] showToast() was called before <ToastProvider> mounted. ' +
          'Make sure ToastProvider wraps your app root (e.g. in app/_layout.tsx).',
      );
    }
    return;
  }
  activeListener(type, message, options);
}

export const toast = {
  show: (type: ToastType, message: string, options?: ToastOptions) =>
    emitShow(type, message, options),
  success: (message: string, options?: ToastOptions) => emitShow('success', message, options),
  error: (message: string, options?: ToastOptions) => emitShow('error', message, options),
  info: (message: string, options?: ToastOptions) => emitShow('info', message, options),
  warning: (message: string, options?: ToastOptions) => emitShow('warning', message, options),
  hide: () => hideListener?.(),
};

// -----------------------------------------------------------------------------
// Context (for components that prefer the hook style / DI-friendly testing)
// -----------------------------------------------------------------------------
interface ToastContextValue {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used within a <ToastProvider>');
  }
  return ctx;
}

// -----------------------------------------------------------------------------
// Visual config per variant
// -----------------------------------------------------------------------------
const VARIANT_CONFIG: Record<
  ToastType,
  { icon: keyof typeof Ionicons.glyphMap; accent: string; iconBg: string; defaultTitle: string }
> = {
  success: {
    icon: 'checkmark-circle',
    accent: '#34C759',
    iconBg: '#E6F9EA',
    defaultTitle: 'Success',
  },
  error: {
    icon: 'close-circle',
    accent: '#FF3B30',
    iconBg: '#FDEAEA',
    defaultTitle: 'Error',
  },
  info: {
    icon: 'information-circle',
    accent: '#3B82F6',
    iconBg: '#E8F0FE',
    defaultTitle: 'Info',
  },
  warning: {
    icon: 'warning',
    accent: '#FF9500',
    iconBg: '#FFF3E0',
    defaultTitle: 'Warning',
  },
};

const DEFAULT_DURATION = 3500;
const SWIPE_DISMISS_THRESHOLD = -40;
const SWIPE_VELOCITY_THRESHOLD = -0.5;

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [queue, setQueue] = useState<ToastItem[]>([]);
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const idCounter = useRef(0);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    idCounter.current += 1;
    const item: ToastItem = {
      id: idCounter.current,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? DEFAULT_DURATION,
    };
    setQueue((prev) => [...prev, item]);
  }, []);

  const animateOut = useCallback(
    (onDone?: () => void) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -200,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dragY.setValue(0);
        onDone?.();
      });
    },
    [translateY, opacity, dragY],
  );

  const hideToast = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (!current) return;
    animateOut(() => setCurrent(null));
  }, [current, animateOut]);

  // Register this provider instance with the module-level emitter.
  useEffect(() => {
    activeListener = showToast;
    hideListener = hideToast;
    return () => {
      activeListener = null;
      hideListener = null;
    };
  }, [showToast, hideToast]);

  // Pull the next toast off the queue once the slot is free.
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrent(next);
    }
  }, [queue, current]);

  // Animate the current toast in, and schedule its auto-dismiss.
  useEffect(() => {
    if (!current) return;

    translateY.setValue(-200);
    opacity.setValue(0);
    dragY.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    dismissTimer.current = setTimeout(() => {
      animateOut(() => setCurrent(null));
    }, current.duration);

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Swipe-up-to-dismiss. Only responds to upward drags so it doesn't fight
  // with pull-to-refresh or scroll gestures on the screen underneath.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) dragY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < SWIPE_DISMISS_THRESHOLD || gesture.vy < SWIPE_VELOCITY_THRESHOLD) {
          if (dismissTimer.current) clearTimeout(dismissTimer.current);
          animateOut(() => setCurrent(null));
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
          }).start();
        }
      },
    }),
  ).current;

  const config = current ? VARIANT_CONFIG[current.type] : null;
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const titleColor = isDark ? '#F2F2F7' : '#1C1C1E';
  const messageColor = isDark ? '#AEAEB2' : '#6B6B70';

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {current && config && (
        <View pointerEvents="box-none" style={[styles.overlay, { paddingTop: insets.top + 8 }]}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderLeftColor: config.accent,
                transform: [{ translateY: Animated.add(translateY, dragY) }],
                opacity,
              },
            ]}
          >
            <Pressable
              onPress={hideToast}
              style={styles.pressableContent}
              accessibilityRole="alert"
              accessibilityLabel={`${current.title ?? config.defaultTitle}: ${current.message}`}
            >
              <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
                <Ionicons name={config.icon} size={20} color={config.accent} />
              </View>

              <View style={styles.textWrap}>
                <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                  {current.title ?? config.defaultTitle}
                </Text>
                <Text style={[styles.message, { color: messageColor }]} numberOfLines={2}>
                  {current.message}
                </Text>
              </View>

              <Pressable hitSlop={10} onPress={hideToast} style={styles.closeButton}>
                <Ionicons name="close" size={16} color={isDark ? '#8E8E93' : '#A0A0A5'} />
              </Pressable>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pressableContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginTop: 2,
  },
});
