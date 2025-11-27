import 'package:flutter_riverpod/flutter_riverpod.dart';

class SettingsState {
  final bool isDarkMode;
  final bool areNotificationsEnabled;

  const SettingsState({
    this.isDarkMode = true,
    this.areNotificationsEnabled = true,
  });

  SettingsState copyWith({
    bool? isDarkMode,
    bool? areNotificationsEnabled,
  }) {
    return SettingsState(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      areNotificationsEnabled:
          areNotificationsEnabled ?? this.areNotificationsEnabled,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(const SettingsState());

  void toggleDarkMode(bool value) {
    state = state.copyWith(isDarkMode: value);
  }

  void toggleNotifications(bool value) {
    state = state.copyWith(areNotificationsEnabled: value);
  }
}

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier();
});
