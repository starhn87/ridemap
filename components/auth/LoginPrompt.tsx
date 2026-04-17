import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
  signInWithEmail,
  signUpWithEmail,
} from '@/lib/auth';

export default function LoginPrompt({ message }: { message?: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
        Alert.alert('가입 완료', '인증 이메일을 확인해주세요.');
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error: any) {
      Alert.alert('오류', error.message ?? '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {isSignUp ? '회원가입' : '로그인이 필요합니다'}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message ?? '로그인하고 라이더 커뮤니티에 참여하세요.'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.buttons}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F9FAFB',
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="이메일"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F9FAFB',
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="비밀번호"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            onPress={handleEmailAuth}
            style={({ pressed }) => [
              styles.emailButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}>
            <Text style={styles.emailButtonText}>
              {isSignUp ? '회원가입' : '이메일로 로그인'}
            </Text>
          </Pressable>

          <Pressable onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={[styles.toggleText, { color: colors.tint }]}>
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </Text>
          </Pressable>
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  emailButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});
