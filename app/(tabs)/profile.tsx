import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import LoginPrompt from '@/components/auth/LoginPrompt';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ThemeMode = 'system' | 'light' | 'dark';

function ThemeOption({
  label,
  value,
  current,
  onPress,
}: {
  label: string;
  value: ThemeMode;
  current: ThemeMode;
  onPress: (v: ThemeMode) => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isActive = current === value;

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[
        styles.themeOption,
        {
          backgroundColor: isActive
            ? '#F97316'
            : colorScheme === 'dark'
              ? '#1A1A1A'
              : '#F3F4F6',
          borderColor: isActive ? '#F97316' : colors.border,
        },
      ]}>
      <Text
        style={[
          styles.themeLabel,
          { color: isActive ? '#FFFFFF' : colors.text },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.menuItem,
        animatedStyle,
        {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F9FAFB',
          borderColor: colors.border,
        },
      ]}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text
        style={[
          styles.menuLabel,
          { color: danger ? '#EF4444' : colors.text },
        ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { mode, setMode } = useThemeStore();

  if (!user) {
    return <LoginPrompt message="로그인하고 마이페이지를 확인하세요." />;
  }

  const displayName = user.user_metadata?.name
    ?? user.user_metadata?.full_name
    ?? user.email
    ?? '라이더';

  const handleSignOut = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {displayName}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user.email}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          테마
        </Text>
        <View style={styles.themeRow}>
          <ThemeOption label="시스템" value="system" current={mode} onPress={setMode} />
          <ThemeOption label="라이트" value="light" current={mode} onPress={setMode} />
          <ThemeOption label="다크" value="dark" current={mode} onPress={setMode} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.menu}>
        <MenuItem icon="⭐" label="즐겨찾기" onPress={() => {}} />
        <MenuItem icon="📝" label="내 제보 목록" onPress={() => {}} />
        <MenuItem icon="💬" label="내 리뷰" onPress={() => {}} />
        <MenuItem
          icon="🚪"
          label="로그아웃"
          onPress={handleSignOut}
          danger
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  menu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
