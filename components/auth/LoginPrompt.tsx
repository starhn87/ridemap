import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
  signInWithKakao,
  signInWithApple,
  signInWithGoogle,
  signInWithNaver,
} from '@/lib/auth';

function SocialButton({
  label,
  backgroundColor,
  textColor,
  onPress,
}: {
  label: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.8 : 1 },
      ]}>
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export default function LoginPrompt({ message }: { message?: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);

  const handleLogin = async (loginFn: () => Promise<void>) => {
    setLoading(true);
    try {
      await loginFn();
    } catch {
      // 로그인 취소 등
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        로그인이 필요합니다
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message ?? '로그인하고 라이더 커뮤니티에 참여하세요.'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.buttons}>
          <SocialButton
            label="카카오로 시작하기"
            backgroundColor="#FEE500"
            textColor="#191919"
            onPress={() => handleLogin(signInWithKakao)}
          />
          <SocialButton
            label="네이버로 시작하기"
            backgroundColor="#03C75A"
            textColor="#FFFFFF"
            onPress={() => handleLogin(signInWithNaver)}
          />
          <SocialButton
            label="Google로 시작하기"
            backgroundColor="#FFFFFF"
            textColor="#1F1F1F"
            onPress={() => handleLogin(signInWithGoogle)}
          />
          <SocialButton
            label="Apple로 시작하기"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={() => handleLogin(signInWithApple)}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
