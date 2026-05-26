import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isDarkMode: boolean;
  areNotificationsEnabled: boolean;
  setDarkMode: (value: boolean) => void;
  setNotificationsEnabled: (value: boolean) => void;
  loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = 'optivista_settings';

export const useSettingsStore = create<SettingsState>((set) => ({
  isDarkMode: false,
  areNotificationsEnabled: true,

  setDarkMode: (value) => {
    set({ isDarkMode: value });
    AsyncStorage.getItem(SETTINGS_KEY).then((stored) => {
      const settings = stored ? JSON.parse(stored) : {};
      settings.isDarkMode = value;
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    });
  },

  setNotificationsEnabled: (value) => {
    set({ areNotificationsEnabled: value });
    AsyncStorage.getItem(SETTINGS_KEY).then((stored) => {
      const settings = stored ? JSON.parse(stored) : {};
      settings.areNotificationsEnabled = value;
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    });
  },

  loadSettings: async () => {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      set({ isDarkMode: settings.isDarkMode ?? false, areNotificationsEnabled: settings.areNotificationsEnabled ?? true });
    }
  },
}));
