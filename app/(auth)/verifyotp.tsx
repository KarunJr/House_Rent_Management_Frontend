import OtpInput, { OtpStatus } from '@/components/auth/OtpInput';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const CORRECT_CODE = '123456'; // demo only — replace with your real check

const colors = {
  background: '#FFFFFF',
  text: '#1C1C1E',
  subtext: '#6B6B70',
  link: '#3B82F6',
  error: '#FF3B30',
  success: '#34C759',
  buttonDisabledBg: '#E1E1E6',
  buttonDisabledText: '#9B9BA1',
  buttonActiveBg: '#1C1C1E',
  buttonActiveText: '#FFFFFF',
};

export default function VerifyOtp() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<OtpStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const phoneNumberMasked = '+628 123******';

  const handleComplete = (otp: string) => {
    setStatus('verifying');

    // Replace this block with your real API call, e.g.:
    // const res = await api.post('/auth/verify-otp', { code: otp });
    resetTimer.current = setTimeout(() => {
      if (otp === CORRECT_CODE) {
        setStatus('success');
        // give the user a beat to see the green "Accepted" state, then move on
        setTimeout(() => router.replace('/login'), 700);
      } else {
        setStatus('error');
      }
    }, 900);
  };

  const handleResend = () => {
    setCode('');
    setStatus('idle');
    // trigger your resend-code API call here
  };

  const statusMessage =
    status === 'error'
      ? 'Incorrect code. Please try again'
      : status === 'verifying'
        ? 'Verifying your OTP...'
        : status === 'success'
          ? 'Accepted'
          : null;

  const statusColor =
    status === 'error' ? colors.error : status === 'success' ? colors.success : colors.subtext;

  const canContinue = code.length === 6 && status !== 'verifying';

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Verify account with OTP</Text>

        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          We&#39;ve sent a 6-digit code to {phoneNumberMasked}
        </Text>

        <OtpInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          status={status}
          style={styles.otpRow}
        />

        {statusMessage && (
          <Text style={[styles.statusText, { color: statusColor }]}>{statusMessage}</Text>
        )}

        {status === 'error' && (
          <Pressable onPress={handleResend} hitSlop={8}>
            <Text style={[styles.resendText, { color: colors.link }]}>Resend code</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          disabled={!canContinue}
          onPress={() => handleComplete(code)}
          style={[
            styles.continueButton,
            {
              backgroundColor: canContinue ? colors.buttonActiveBg : colors.buttonDisabledBg,
            },
          ]}
        >
          <Text
            style={[
              styles.continueText,
              {
                color: canContinue ? colors.buttonActiveText : colors.buttonDisabledText,
              },
            ]}
          >
            Continue
          </Text>
        </Pressable>

        <Text style={[styles.termsText, { color: colors.subtext }]}>
          By entering your number you agree to our{'\n'}
          <Text style={[styles.termsLink, { color: colors.text }]}>Terms & Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },

  otpRow: {
    justifyContent: 'flex-start',
    gap: 12,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 14,
  },

  resendText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textDecorationLine: 'underline',
  },

  footer: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  continueButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  continueText: {
    fontSize: 16,
    fontWeight: '600',
  },

  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
