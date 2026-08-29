import React from 'react';
import { Image, Text, View } from 'react-native';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

/**
 * Circular avatar with a graceful fallback to initials-on-terracotta when
 * no image is available (or fails to load) — never shows a broken image.
 */
export function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (!uri || failed) {
    return (
      <View
        style={dimension}
        className="items-center justify-center bg-terracotta-soft"
      >
        <Text
          className="font-body-semibold text-terracotta-deep"
          style={{ fontSize: size * 0.38 }}
        >
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={dimension}
      onError={() => setFailed(true)}
      accessibilityLabel={`${name}'s avatar`}
    />
  );
}
