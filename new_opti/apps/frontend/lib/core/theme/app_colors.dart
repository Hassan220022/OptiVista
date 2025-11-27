import 'package:flutter/material.dart';

class AppColors {
  // Primary Brand Colors
  static const Color primary = Color(0xFF00F0FF); // Electric Cyan
  static const Color secondary = Color(0xFF7000FF); // Electric Purple
  static const Color accent = Color(0xFFFF003C); // Cyberpunk Red

  // Background Colors
  static const Color background = Color(0xFF050505); // Almost Black
  static const Color surface = Color(0xFF121212); // Dark Grey
  static const Color surfaceLight = Color(0xFF1E1E1E); // Lighter Grey

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB3B3B3);
  static const Color textTertiary = Color(0xFF808080);

  // Status Colors
  static const Color success = Color(0xFF00FF94);
  static const Color warning = Color(0xFFFFB800);
  static const Color error = Color(0xFFFF003C);
  static const Color info = Color(0xFF00F0FF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkGradient = LinearGradient(
    colors: [surface, background],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // Glassmorphism
  static Color glassWhite = Colors.white.withOpacity(0.05);
  static Color glassBlack = Colors.black.withOpacity(0.5);
}
