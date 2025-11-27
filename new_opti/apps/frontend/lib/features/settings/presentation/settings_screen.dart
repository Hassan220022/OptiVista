import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/routing/route_names.dart';
import '../../auth/data/auth_repository.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import 'legal_text_screen.dart';

import '../providers/settings_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          _buildSectionHeader('Preferences'),
          _buildSettingsTile(
            context,
            icon: Icons.dark_mode_outlined,
            title: 'Dark Mode',
            trailing: Switch(
              value: settings.isDarkMode,
              onChanged: (value) => notifier.toggleDarkMode(value),
              activeThumbColor: AppColors.primary,
            ),
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            context,
            icon: Icons.notifications_outlined,
            title: 'Notifications',
            trailing: Switch(
              value: settings.areNotificationsEnabled,
              onChanged: (value) => notifier.toggleNotifications(value),
              activeThumbColor: AppColors.primary,
            ),
          ),
          const Divider(),
          _buildSectionHeader('Support'),
          _buildSettingsTile(
            context,
            icon: Icons.feedback_outlined,
            title: 'Send Feedback',
            onTap: () => context.pushNamed('feedback'),
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            context,
            icon: Icons.info_outline,
            title: 'About OptiVista',
            onTap: () {
              showAboutDialog(
                context: context,
                applicationName: 'OptiVista',
                applicationVersion: '1.0.0',
                applicationLegalese: '© 2024 OptiVista Inc.',
              );
            },
          ),
          const Divider(),
          _buildSectionHeader('Legal'),
          _buildSettingsTile(
            context,
            icon: Icons.description_outlined,
            title: 'Terms of Service',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const LegalTextScreen(
                    documentType: LegalDocumentType.terms,
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            context,
            icon: Icons.privacy_tip_outlined,
            title: 'Privacy Policy',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const LegalTextScreen(
                    documentType: LegalDocumentType.privacy,
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            context,
            icon: Icons.assignment_return_outlined,
            title: 'Return Policy',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const LegalTextScreen(
                    documentType: LegalDocumentType.returns,
                  ),
                ),
              );
            },
          ),
          const Divider(),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.error.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.error.withValues(alpha: 0.2)),
            ),
            child: ListTile(
              leading: const Icon(Icons.logout, color: AppColors.error),
              title: const Text(
                'Sign Out',
                style: TextStyle(
                  color: AppColors.error,
                  fontWeight: FontWeight.bold,
                ),
              ),
              onTap: () async {
                await ref.read(authRepositoryProvider).signOut();
                if (context.mounted) {
                  context.goNamed(RouteNames.signIn);
                }
              },
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Text(
        title.toUpperCase(),
        style: AppTextStyles.labelMedium.copyWith(
          color: AppColors.textTertiary,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildSettingsTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppColors.primary),
        ),
        title: Text(title, style: AppTextStyles.titleMedium),
        trailing: trailing ??
            const Icon(Icons.chevron_right, color: AppColors.textTertiary),
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
