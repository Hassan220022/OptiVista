import { Platform, type ShadowStyleIOS } from 'react-native';

/**
 * Shadow tokens for both native and web.
 * On native, uses the `shadow*` RN style props (iOS) + elevation (Android).
 * On web, uses `boxShadow`.
 */
function createShadow(
  elevation: number,
  webValue: string
): ShadowStyleIOS & { elevation?: number; boxShadow?: string } {
  if (Platform.OS === 'web') {
    return { boxShadow: webValue };
  }
  return {
    shadowOffset: { width: 0, height: elevation / 2 },
    shadowOpacity: 0.1 + elevation * 0.02,
    shadowRadius: elevation,
    elevation,
  };
}

export const Shadows = {
  sm: createShadow(1, '0 1px 2px rgba(0, 0, 0, 0.05)'),
  md: createShadow(3, '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'),
  lg: createShadow(6, '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'),
  xl: createShadow(10, '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'),
  premium: createShadow(16, '0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
} as const;
