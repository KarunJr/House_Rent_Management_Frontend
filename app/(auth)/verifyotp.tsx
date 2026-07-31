import OtpInput, { OtpStatus } from '@/components/auth/OtpInput';
// import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  // const router = useRouter();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<OtpStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const RESET_SECONDS = 10;
  const [timer, setTimer] = useState<number>(RESET_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);

  const handleVerifyOtp = (otp: string) => {
    setStatus('verifying');

    // Replace this block with your real API call, e.g.:
    // const res = await api.post('/auth/verify-otp', { code: otp });
    resetTimer.current = setTimeout(() => {
      if (otp === CORRECT_CODE) {
        setStatus('success');
        // give the user a beat to see the green "Accepted" state, then move on
        // setTimeout(() => router.replace('/login'), 700);
      } else {
        setStatus('error');
      }
    }, 900);
  };

  const handleResend = () => {
    setCode('');
    setStatus('idle');

    setTimer(RESET_SECONDS);
    setCanResend(false);
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

  const canConfirm = code.length === 6 && status !== 'verifying';

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Verify account with OTP</Text>

        <Text style={[{ color: colors.subtext }]}>We&#39;ve sent the verfification code</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>to your email address</Text>

        <OtpInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={handleVerifyOtp}
          status={status}
          style={styles.otpRow}
        />

        {statusMessage && (
          <Text style={[styles.statusText, { color: statusColor }]}>{statusMessage}</Text>
        )}

        <Pressable
          disabled={!canConfirm}
          onPress={() => handleVerifyOtp(code)}
          style={[
            styles.confirmButton,
            {
              backgroundColor: canConfirm ? colors.buttonActiveBg : colors.buttonDisabledBg,
            },
          ]}
        >
          <Text
            style={[
              styles.confirmText,
              {
                color: canConfirm ? colors.buttonActiveText : colors.buttonDisabledText,
              },
            ]}
          >
            Confirm
          </Text>
        </Pressable>

        <View style={styles.resendContent}>
          <Text style={[{ color: colors.subtext }]}>Didn&#39;t receive code?</Text>
          {canResend ? (
            <Pressable onPress={handleResend} hitSlop={8}>
              <Text style={[styles.resendText, { color: colors.link }]}>Resend code</Text>
            </Pressable>
          ) : (
              <Text style={[styles.resendText, { color: colors.link }]}>Resend in {timer}s</Text>
          )}
        </View>
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
  resendContent: {
    marginTop: 14,
    // flexDirection: 'row',
    // justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },

  resendText: {
    fontSize: 13,
    fontWeight: '600',
  },

  footer: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  confirmButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    // marginBottom: 14,
  },

  confirmText: {
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
