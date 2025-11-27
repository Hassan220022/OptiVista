import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

/// Category filter chips data
class CategoryChip {
  final String id;
  final String label;
  final IconData? icon;

  const CategoryChip({
    required this.id,
    required this.label,
    this.icon,
  });
}

/// Scrollable horizontal row of category filter chips
class CategoryChipRow extends StatelessWidget {
  final List<CategoryChip> categories;
  final String? selectedCategoryId;
  final void Function(CategoryChip category)? onCategorySelected;

  const CategoryChipRow({
    super.key,
    required this.categories,
    this.selectedCategoryId,
    this.onCategorySelected,
  });

  /// Default categories for eyewear
  static List<CategoryChip> get defaultCategories => const [
        CategoryChip(id: 'all', label: 'All', icon: Icons.grid_view_rounded),
        CategoryChip(id: 'men', label: 'Men', icon: Icons.man),
        CategoryChip(id: 'women', label: 'Women', icon: Icons.woman),
        CategoryChip(id: 'unisex', label: 'Unisex', icon: Icons.people),
        CategoryChip(id: 'sunglasses', label: 'Sunglasses', icon: Icons.wb_sunny),
        CategoryChip(id: 'optical', label: 'Optical', icon: Icons.visibility),
        CategoryChip(id: 'sport', label: 'Sport', icon: Icons.sports_tennis),
      ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final category = categories[index];
          final isSelected = category.id == selectedCategoryId;

          return _CategoryChipItem(
            category: category,
            isSelected: isSelected,
            onTap: () => onCategorySelected?.call(category),
          );
        },
      ),
    );
  }
}

class _CategoryChipItem extends StatelessWidget {
  final CategoryChip category;
  final bool isSelected;
  final VoidCallback? onTap;

  const _CategoryChipItem({
    required this.category,
    required this.isSelected,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          gradient: isSelected ? AppColors.primaryGradient : null,
          color: isSelected ? null : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected
                ? Colors.transparent
                : Colors.white.withOpacity(0.1),
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (category.icon != null) ...[
              Icon(
                category.icon,
                size: 18,
                color: isSelected ? Colors.white : AppColors.textSecondary,
              ),
              const SizedBox(width: 8),
            ],
            Text(
              category.label,
              style: AppTextStyles.labelLarge.copyWith(
                color: isSelected ? Colors.white : AppColors.textPrimary,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
