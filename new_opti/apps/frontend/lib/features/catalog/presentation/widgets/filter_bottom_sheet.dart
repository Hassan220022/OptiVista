import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/product_provider.dart';
import '../../../../shared/widgets/app_button.dart';

class FilterBottomSheet extends ConsumerStatefulWidget {
  const FilterBottomSheet({super.key});

  @override
  ConsumerState<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends ConsumerState<FilterBottomSheet> {
  String? _selectedGender;
  RangeValues _priceRange = const RangeValues(0, 500);

  @override
  void initState() {
    super.initState();
    final currentFilters = ref.read(productFilterProvider);
    _selectedGender = currentFilters.gender;
    if (currentFilters.minPrice != null && currentFilters.maxPrice != null) {
      _priceRange = RangeValues(
        currentFilters.minPrice!.toDouble() / 100,
        currentFilters.maxPrice!.toDouble() / 100,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Filters',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => context.pop(),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Gender',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            children: ['Men', 'Women', 'Unisex'].map((gender) {
              final isSelected = _selectedGender == gender.toLowerCase();
              return FilterChip(
                label: Text(gender),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    _selectedGender = selected ? gender.toLowerCase() : null;
                  });
                },
                backgroundColor: Colors.black,
                selectedColor: const Color(0xFF00E5FF).withOpacity(0.2),
                checkmarkColor: const Color(0xFF00E5FF),
                labelStyle: TextStyle(
                  color: isSelected ? const Color(0xFF00E5FF) : Colors.white,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: BorderSide(
                    color:
                        isSelected ? const Color(0xFF00E5FF) : Colors.white24,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          const Text(
            'Price Range',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          RangeSlider(
            values: _priceRange,
            min: 0,
            max: 1000,
            divisions: 20,
            activeColor: const Color(0xFF00E5FF),
            inactiveColor: Colors.white24,
            labels: RangeLabels(
              '\$${_priceRange.start.round()}',
              '\$${_priceRange.end.round()}',
            ),
            onChanged: (values) {
              setState(() {
                _priceRange = values;
              });
            },
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('\$${_priceRange.start.round()}'),
              Text('\$${_priceRange.end.round()}'),
            ],
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    ref.read(productFilterProvider.notifier).state =
                        const ProductFilterState();
                    context.pop();
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Reset'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: AppButton(
                  text: 'Apply Filters',
                  onPressed: () {
                    ref
                        .read(productFilterProvider.notifier)
                        .update((state) => state.copyWith(
                              gender: _selectedGender,
                              minPrice: (_priceRange.start * 100).toInt(),
                              maxPrice: (_priceRange.end * 100).toInt(),
                            ));
                    context.pop();
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
