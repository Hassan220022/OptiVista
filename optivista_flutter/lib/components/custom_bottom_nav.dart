import 'package:flutter/material.dart';
import '../flutter_flow/flutter_flow_theme.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNav({
    Key? key,
    required this.currentIndex,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: FlutterFlowTheme.of(context).secondaryBackground,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Container(
          height: 65,
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                context: context,
                icon: Icons.home_rounded,
                label: 'Home',
                index: 0,
                isSelected: currentIndex == 0,
              ),
              _buildNavItem(
                context: context,
                icon: Icons.category_rounded,
                label: 'Catalog',
                index: 1,
                isSelected: currentIndex == 1,
              ),
              _buildNavItem(
                context: context,
                icon: Icons.view_in_ar_rounded,
                label: 'AR Try-On',
                index: 2,
                isSelected: currentIndex == 2,
                isPrimary: true,
              ),
              _buildNavItem(
                context: context,
                icon: Icons.shopping_bag_rounded,
                label: 'Cart',
                index: 3,
                isSelected: currentIndex == 3,
              ),
              _buildNavItem(
                context: context,
                icon: Icons.person_rounded,
                label: 'Profile',
                index: 4,
                isSelected: currentIndex == 4,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required IconData icon,
    required String label,
    required int index,
    required bool isSelected,
    bool isPrimary = false,
  }) {
    final theme = FlutterFlowTheme.of(context);
    final color = isSelected
        ? theme.primary
        : isPrimary
            ? theme.primary.withOpacity(0.7)
            : theme.secondaryText;

    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: isPrimary ? EdgeInsets.all(8) : null,
              decoration: isPrimary
                  ? BoxDecoration(
                      color: theme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    )
                  : null,
              child: Icon(
                icon,
                color: color,
                size: isPrimary ? 28 : 24,
              ),
            ),
            SizedBox(height: 4),
            Text(
              label,
              style: theme.bodySmall.override(
                fontFamily: 'Inter',
                color: color,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}