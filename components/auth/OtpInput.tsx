import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
} from 'react-native';

export type OtpStatus = 'idle' | 'verifying' | 'error' | 'success';

const colors = {
  background: '#F5F5F7',
  boxBackground: '#FFFFFF',
  border: '#E1E1E6',
  borderFocused: '#3B82F6',
  borderError: '#FF3B30',
  borderSuccess: '#34C759',
  text: '#1C1C1E',
  disabledText: '#8E8E93',
};

export interface OtpInputProps {
  /** Number of digits. Defaults to 6. */
  length?: number;
  /** Fires the instant the code is fully entered (typed or pasted). */
  onComplete: (code: string) => void;
  /** Fires on every change, useful for controlled forms / clearing errors. */
  onChange?: (code: string) => void;
  /** Controlled value. If provided, component stays in sync with it. */
  value?: string;
  /** Autofocus the first box on mount. Defaults to true. */
  autoFocus?: boolean;
  /**
   * Drives the visual state of all boxes at once:
   * - 'idle'      → normal / focus-highlighted borders
   * - 'verifying' → neutral borders, inputs disabled
   * - 'error'     → red borders, inputs re-enabled for retry
   * - 'success'   → green borders, inputs disabled
   */
  status?: OtpStatus;
  style?: StyleProp<ViewStyle>;
  boxSize?: number;
}

const OtpInput = ({
  length = 6,
  onComplete,
  onChange,
  value,
  autoFocus = true,
  status = 'idle',
  style,
  boxSize = 48,
}: OtpInputProps) => {

  const [digits, setDigits] = useState<string[]>(
    () =>
      value?.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length) ??
      Array(length).fill(''),
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const lastCompletedCode = useRef<string>('');

  useEffect(() => {
    if (value === undefined) return;
    const next = value.split('').slice(0, length);
    while (next.length < length) next.push('');
    setDigits(next);
  }, [value, length]);

  const emitChange = useCallback(
    (next: string[]) => {
      const code = next.join('');
      onChange?.(code);
      if (code.length === length && next.every((d) => d !== '')) {
        if (lastCompletedCode.current !== code) {
          lastCompletedCode.current = code;
          onComplete(code);
        }
      } else {
        lastCompletedCode.current = '';
      }
    },
    [length, onChange, onComplete]
  );

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) inputRefs.current[index]?.focus();
  };

  const disabled = status === 'verifying' || status === 'success';

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      const sanitized = text.replace(/[^0-9]/g, '').slice(0, length);
      if (!sanitized) return;
      const next = Array(length).fill('');
      for (let i = 0; i < sanitized.length; i++) next[i] = sanitized[i];
      setDigits(next);
      emitChange(next);
      const nextFocusIndex = Math.min(sanitized.length, length - 1);
      if (sanitized.length >= length) {
        inputRefs.current[nextFocusIndex]?.blur();
      } else {
        focusInput(nextFocusIndex);
      }
      return;
    }

    const digit = text.replace(/[^0-9]/g, '');
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    emitChange(next);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    } else if (digit && index === length - 1) {
      inputRefs.current[index]?.blur();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key !== 'Backspace') return;
    if (digits[index]) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      emitChange(next);
    } else if (index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      emitChange(next);
      focusInput(index - 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index && status === 'idle';
        const isFilled = !!digits[index];

        let borderColor = colors.border;
        if (status === 'error') borderColor = colors.borderError;
        else if (status === 'success') borderColor = colors.borderSuccess;
        else if (isFocused) borderColor = colors.borderFocused;
        else if (isFilled) borderColor = colors.border;

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digits[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
            maxLength={length}
            autoFocus={autoFocus && index === 0}
            editable={!disabled}
            selectTextOnFocus
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            importantForAutofill="yes"
            accessibilityLabel={`Digit ${index + 1} of ${length}`}
            style={[
              styles.box,
              {
                width: boxSize,
                height: boxSize,
                borderColor,
                backgroundColor: colors.boxBackground,
                color: disabled ? colors.disabledText : colors.text,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  box: {
    borderWidth: 1.5,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OtpInput;
