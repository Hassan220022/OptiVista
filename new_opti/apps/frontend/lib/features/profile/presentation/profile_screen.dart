import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../auth/data/auth_repository.dart';

// Simple provider to fetch user profile
final userProfileProvider = FutureProvider.autoDispose((ref) async {
  final dio = ref.watch(apiClientProvider);
  final response = await dio.get('/users/me');
  return response.data;
});

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authRepositoryProvider).signOut();
            },
          ),
        ],
      ),
      body: profileAsync.when(
        data: (data) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white.withValues(alpha: 0.2),
                      child: Text(
                        (data['full_name'] as String?)
                                ?.substring(0, 1)
                                .toUpperCase() ??
                            'U',
                        style: AppTextStyles.displaySmall
                            .copyWith(color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            data['full_name'] ?? 'User',
                            style: AppTextStyles.headlineSmall
                                .copyWith(color: Colors.white),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            data['email'] ?? 'No Email',
                            style: AppTextStyles.bodyMedium
                                .copyWith(color: Colors.white70),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              (data['role'] as String? ?? 'User').toUpperCase(),
                              style: AppTextStyles.labelSmall.copyWith(
                                color: Colors.white,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              Text('Account', style: AppTextStyles.titleLarge),
              const SizedBox(height: 16),
              _buildProfileMenuItem(
                context,
                icon: Icons.person_outline,
                title: 'Edit Profile',
                onTap: () => context.push('/profile/edit'),
              ),
              const SizedBox(height: 16),
              _buildProfileMenuItem(
                context,
                icon: Icons.location_on_outlined,
                title: 'Addresses',
                onTap: () => context.push('/profile/addresses'),
              ),
              const SizedBox(height: 16),
              _buildProfileMenuItem(
                context,
                icon: Icons.shopping_bag_outlined,
                title: 'My Orders',
                onTap: () => context.goNamed('orders'),
              ),
              const SizedBox(height: 16),
              _buildProfileMenuItem(
                context,
                icon: Icons.settings_outlined,
                title: 'Settings',
                onTap: () => context.goNamed('settings'),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildProfileMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Container(
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
        trailing: Icon(Icons.chevron_right, color: AppColors.textTertiary),
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
