export const brand = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
};

export default {
  light: {
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    card: '#F9FAFB',
    border: '#E5E7EB',
    tint: brand[500],
    tabIconDefault: '#9CA3AF',
    tabIconSelected: brand[500],
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    background: '#0F0F0F',
    card: '#1A1A1A',
    border: '#2A2A2A',
    tint: brand[400],
    tabIconDefault: '#6B7280',
    tabIconSelected: brand[400],
  },
};
