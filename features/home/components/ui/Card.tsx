import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { shadow } from '../../theme/tokens';

interface CardProps extends ViewProps {
  onPress?: () => void;
  className?: string;
}

/**
 * Shared elevated surface used by stat tiles, room rows, and the banner.
 * Renders as Pressable (with a subtle press-scale via opacity) when an
 * onPress handler is supplied, otherwise a plain View.
 */
export function Card({ onPress, className = '', style, children, ...rest }: CardProps) {
  const base = `rounded-2xl bg-surface ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={base}
        style={({ pressed }) => [shadow.card, style, { opacity: pressed ? 0.85 : 1 }]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} style={[shadow.card, style]} {...rest}>
      {children}
    </View>
  );
}
