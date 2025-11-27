import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

/// Quick action card data
class QuickAction {
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final List<Color>? gradientColors;

  const QuickAction({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.gradientColors,
  });
}

/// Grid of quick action cards
class QuickActionRow extends StatelessWidget {
  final List<QuickAction> actions;
  final void Function(QuickAction action)? onActionTap;

  const QuickActionRow({
    super.key,
    required this.actions,
    this.onActionTap,
  });

  /// Default quick actions
  static List<QuickAction> get defaultActions => const [
        QuickAction(
          id: 'browse',
          title: 'Browse All',
          subtitle: 'Explore collection',
          icon: Icons.grid_view_rounded,
          gradientColors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
        ),
        QuickAction(
          id: 'ar_tryon',
          title: 'AR Try-On',
          subtitle: 'Virtual fitting',
          icon: Icons.view_in_ar,
          gradientColors: [Color(0xFF0D9488), Color(0xFF10B981)],
        ),
        QuickAction(
          id: 'orders',
          title: 'My Orders',
          subtitle: 'Track purchases',
          icon: Icons.local_shipping_outlined,
          gradientColors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
        ),
      ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: AppTextStyles.titleLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: actions.map((action) {
              final index = actions.indexOf(action);
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    left: index == 0 ? 0 : 6,
                    right: index == actions.length - 1 ? 0 : 6,
                  ),
                  child: _QuickActionCard(
                    action: action,
                    onTap: () => onActionTap?.call(action),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final QuickAction action;
  final VoidCallback? onTap;

  const _QuickActionCard({
    required this.action,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final gradient = action.gradientColors != null
        ? LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: action.gradientColors!,
          )
        : AppColors.primaryGradient;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 110,
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: (action.gradientColors?.first ?? AppColors.primary)
                  .withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Background pattern
            Positioned(
              right: -20,
              bottom: -20,
              child: Icon(
                action.icon,
                size: 80,
                color: Colors.white.withOpacity(0.15),
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      action.icon,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    action.title,
                    style: AppTextStyles.labelLarge.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    action.subtitle,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 10,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
