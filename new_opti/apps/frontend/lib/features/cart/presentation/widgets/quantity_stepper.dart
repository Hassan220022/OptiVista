import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Quantity stepper for cart items
class QuantityStepper extends StatelessWidget {
  final int quantity;
  final int maxQuantity;
  final ValueChanged<int>? onChanged;
  final bool isLoading;

  const QuantityStepper({
    super.key,
    required this.quantity,
    this.maxQuantity = 99,
    this.onChanged,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Minus button
          _StepperButton(
            icon: Icons.remove,
            onTap: quantity > 1 && !isLoading
                ? () => onChanged?.call(quantity - 1)
                : null,
            isEnabled: quantity > 1 && !isLoading,
          ),
          // Quantity display
          Container(
            width: 40,
            alignment: Alignment.center,
            child: isLoading
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.primary,
                    ),
                  )
                : Text(
                    '$quantity',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
          ),
          // Plus button
          _StepperButton(
            icon: Icons.add,
            onTap: quantity < maxQuantity && !isLoading
                ? () => onChanged?.call(quantity + 1)
                : null,
            isEnabled: quantity < maxQuantity && !isLoading,
          ),
        ],
      ),
    );
  }
}

class _StepperButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  final bool isEnabled;

  const _StepperButton({
    required this.icon,
    this.onTap,
    this.isEnabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        alignment: Alignment.center,
        child: Icon(
          icon,
          size: 18,
          color: isEnabled
              ? AppColors.primary
              : AppColors.textTertiary.withValues(alpha: 0.3),
        ),
      ),
    );
  }
}
