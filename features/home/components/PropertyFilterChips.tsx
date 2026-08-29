import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import type { Property } from '../types/models';

interface PropertyFilterChipsProps {
  properties: Property[];
  selectedId: string | 'all';
  onSelect: (id: string | 'all') => void;
}

export function PropertyFilterChips({
  properties,
  selectedId,
  onSelect,
}: PropertyFilterChipsProps) {
  const options = [{ id: 'all' as const, name: 'All' }, ...properties];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {options.map((option) => {
        const active = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            className={`mr-2 rounded-full border px-4 py-2 ${
              active ? 'border-terracotta bg-terracotta' : 'border-border bg-surface'
            }`}
          >
            <Text
              className={`font-body-medium text-sm ${active ? 'text-white' : 'text-inkMuted'}`}
            >
              {option.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
