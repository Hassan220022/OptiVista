export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  secondary: '#7C3AED',
  accent: '#EC4899',

  // Backgrounds
  background: '#F5F5F5',
  backgroundDark: '#0A0A0A',
  surface: '#FFFFFF',
  surfaceDark: '#1A1A1A',

  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textDark: '#F9FAFB',
  textSecondaryDark: '#9CA3AF',

  // Borders
  border: '#E5E7EB',
  borderDark: '#374151',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Gradients
  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
} as const;

export const DarkColors = {
  ...Colors,
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
};
