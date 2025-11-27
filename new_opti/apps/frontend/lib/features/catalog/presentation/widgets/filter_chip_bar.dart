import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../domain/entities/filter_state.dart';

/// Horizontal bar showing active filters as chips
class FilterChipBar extends StatelessWidget {
  final CatalogFilterState filters;
  final int totalCount;
  final VoidCallback? onClearAll;
  final ValueChanged<SortOption>? onSortChanged;

  const FilterChipBar({
    super.key,
    required this.filters,
    required this.totalCount,
    this.onClearAll,
    this.onSortChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Results count and sort
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$totalCount products',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              // Sort dropdown
              _SortDropdown(
                value: filters.sortBy,
                onChanged: onSortChanged,
              ),
            ],
          ),
          // Active filter chips
          if (filters.hasActiveFilters) ...[
            const SizedBox(height: 12),
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  // Clear all button
                  _FilterChip(
                    label: 'Clear All',
                    isSpecial: true,
                    onTap: onClearAll,
                  ),
                  const SizedBox(width: 8),
                  // Gender filter
                  if (filters.gender != null)
                    _FilterChip(
                      label: filters.gender!,
                      onTap: () {},
                    ),
                  // AR Only filter
                  if (filters.arOnly)
                    _FilterChip(
                      label: 'AR Only',
                      icon: Icons.view_in_ar,
                      onTap: () {},
                    ),
                  // Price range
                  if (filters.minPrice != null || filters.maxPrice != null)
                    _FilterChip(
                      label: _getPriceLabel(),
                      onTap: () {},
                    ),
                  // Shapes
                  for (final shape in filters.shapes)
                    _FilterChip(
                      label: shape,
                      onTap: () {},
                    ),
                  // Colors
                  for (final color in filters.colors)
                    _FilterChip(
                      label: color,
                      onTap: () {},
                    ),
                  // Brands
                  for (final brand in filters.brands)
                    _FilterChip(
                      label: brand,
                      onTap: () {},
                    ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _getPriceLabel() {
    if (filters.minPrice != null && filters.maxPrice != null) {
      return '\$${filters.minPrice!.toInt()} - \$${filters.maxPrice!.toInt()}';
    } else if (filters.minPrice != null) {
      return '\$${filters.minPrice!.toInt()}+';
    } else if (filters.maxPrice != null) {
      return 'Under \$${filters.maxPrice!.toInt()}';
    }
    return '';
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final IconData? icon;
  final bool isSpecial;
  final VoidCallback? onTap;

  const _FilterChip({
    required this.label,
    this.icon,
    this.isSpecial = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: isSpecial
              ? AppColors.error.withOpacity(0.1)
              : AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSpecial
                ? AppColors.error.withOpacity(0.3)
                : AppColors.primary.withOpacity(0.3),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 14,
                color: isSpecial ? AppColors.error : AppColors.primary,
              ),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: AppTextStyles.labelMedium.copyWith(
                color: isSpecial ? AppColors.error : AppColors.primary,
              ),
            ),
            if (!isSpecial) ...[
              const SizedBox(width: 4),
              Icon(
                Icons.close,
                size: 14,
                color: AppColors.primary,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SortDropdown extends StatelessWidget {
  final SortOption value;
  final ValueChanged<SortOption>? onChanged;

  const _SortDropdown({
    required this.value,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<SortOption>(
      initialValue: value,
      onSelected: onChanged,
      offset: const Offset(0, 36),
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              value.label,
              style: AppTextStyles.labelMedium,
            ),
            const SizedBox(width: 4),
            Icon(
              Icons.keyboard_arrow_down,
              size: 18,
              color: AppColors.textSecondary,
            ),
          ],
        ),
      ),
      itemBuilder: (context) => SortOption.values
          .map(
            (option) => PopupMenuItem(
              value: option,
              child: Row(
                children: [
                  if (option == value)
                    Icon(
                      Icons.check,
                      size: 18,
                      color: AppColors.primary,
                    )
                  else
                    const SizedBox(width: 18),
                  const SizedBox(width: 8),
                  Text(
                    option.label,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: option == value
                          ? AppColors.primary
                          : AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }
}
