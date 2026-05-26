import { Redirect } from 'expo-router';

/**
 * Root index route — redirects to the tab navigator.
 * Without this file, Expo Router has no handler for "/".
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
