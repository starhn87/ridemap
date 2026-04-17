import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';

export function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const mode = useThemeStore((s) => s.mode);

  if (mode === 'light' || mode === 'dark') return mode;
  return systemScheme;
}
