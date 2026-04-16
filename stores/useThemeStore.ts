import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  loadMode: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  setMode: async (mode) => {
    set({ mode });
    await AsyncStorage.setItem('theme-mode', mode);
  },
  loadMode: async () => {
    const saved = await AsyncStorage.getItem('theme-mode');
    if (saved === 'system' || saved === 'light' || saved === 'dark') {
      set({ mode: saved });
    }
  },
}));
