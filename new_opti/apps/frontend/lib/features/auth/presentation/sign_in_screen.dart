import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/routing/route_names.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../data/auth_repository.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isAppleLoading = false;
  String? _errorMessage;
  bool _isAppleAvailable = false;

  @override
  void initState() {
    super.initState();
    _checkAppleSignInAvailability();
  }

  Future<void> _checkAppleSignInAvailability() async {
    if (Platform.isIOS || Platform.isMacOS) {
      final available = await ref.read(authRepositoryProvider).isAppleSignInAvailable();
      if (mounted) {
        setState(() => _isAppleAvailable = available);
      }
    }
  }

  Future<void> _signIn() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authRepositoryProvider).signIn(
            email: _emailController.text.trim(),
            password: _passwordController.text,
          );
      // Navigation is handled by the router redirect based on auth state
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() {
      _isGoogleLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authRepositoryProvider).signInWithGoogle();
      // Navigation is handled by the router redirect based on auth state
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = _formatError(e.toString());
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isGoogleLoading = false;
        });
      }
    }
  }

  Future<void> _signInWithApple() async {
    setState(() {
      _isAppleLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authRepositoryProvider).signInWithApple();
      // Navigation is handled by the router redirect based on auth state
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = _formatError(e.toString());
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isAppleLoading = false;
        });
      }
    }
  }

  String _formatError(String error) {
    if (error.contains('cancelled') || error.contains('canceled')) {
      return 'Sign-in was cancelled';
    }
    if (error.contains('network')) {
      return 'Network error. Please check your connection.';
    }
    return error.replaceAll('Exception:', '').trim();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF000000),
              Color(0xFF1A1A1A),
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(
                    Icons.visibility, // Placeholder for Logo
                    size: 80,
                    color: Color(0xFF00E5FF),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Welcome Back',
                    style: Theme.of(context).textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to continue your AR journey',
                    style: Theme.of(context).textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  if (_errorMessage != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 24),
                      decoration: BoxDecoration(
                        color: Theme.of(context)
                            .colorScheme
                            .error
                            .withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                            color: Theme.of(context).colorScheme.error),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.error),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  AppTextField(
                    controller: _emailController,
                    label: 'Email',
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _passwordController,
                    label: 'Password',
                    obscureText: true,
                  ),
                  const SizedBox(height: 16),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => context.push('/forgot-password'),
                      child: Text(
                        'Forgot Password?',
                        style: TextStyle(color: Colors.grey[400]),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  AppButton(
                    text: 'SIGN IN',
                    onPressed: _isLoading ? null : _signIn,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: 32),
                  // Divider with "or"
                  Row(
                    children: [
                      Expanded(child: Divider(color: Colors.grey[600])),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'or continue with',
                          style: TextStyle(color: Colors.grey[400], fontSize: 14),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.grey[600])),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Social Login Buttons
                  Row(
                    children: [
                      // Google Sign-In Button
                      Expanded(
                        child: _SocialSignInButton(
                          onPressed: _isGoogleLoading ? null : _signInWithGoogle,
                          isLoading: _isGoogleLoading,
                          icon: _GoogleIcon(),
                          label: 'Google',
                        ),
                      ),
                      // Apple Sign-In Button (iOS/macOS only)
                      if (_isAppleAvailable) ...[
                        const SizedBox(width: 16),
                        Expanded(
                          child: _SocialSignInButton(
                            onPressed: _isAppleLoading ? null : _signInWithApple,
                            isLoading: _isAppleLoading,
                            icon: const Icon(Icons.apple, color: Colors.white, size: 24),
                            label: 'Apple',
                            backgroundColor: Colors.black,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Don\'t have an account?',
                        style: TextStyle(color: Colors.grey[400]),
                      ),
                      TextButton(
                        onPressed: () => context.push(RouteNames.signUp),
                        child: const Text('Sign Up'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Social sign-in button widget
class _SocialSignInButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final bool isLoading;
  final Widget icon;
  final String label;
  final Color? backgroundColor;

  const _SocialSignInButton({
    required this.onPressed,
    required this.isLoading,
    required this.icon,
    required this.label,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: backgroundColor ?? Colors.white,
          side: BorderSide(color: Colors.grey[700]!),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: backgroundColor != null ? Colors.white : Colors.black,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  icon,
                  const SizedBox(width: 8),
                  Text(
                    label,
                    style: TextStyle(
                      color: backgroundColor != null ? Colors.white : Colors.black,
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

/// Custom Google "G" icon
class _GoogleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 24,
      height: 24,
      child: CustomPaint(
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double s = size.width / 24;
    
    // Blue
    final bluePaint = Paint()..color = const Color(0xFF4285F4);
    final bluePath = Path()
      ..moveTo(23.52 * s, 12.27 * s)
      ..cubicTo(23.52 * s, 11.48 * s, 23.45 * s, 10.73 * s, 23.32 * s, 10 * s)
      ..lineTo(12 * s, 10 * s)
      ..lineTo(12 * s, 14.26 * s)
      ..lineTo(18.48 * s, 14.26 * s)
      ..cubicTo(18.21 * s, 15.63 * s, 17.4 * s, 16.79 * s, 16.21 * s, 17.57 * s)
      ..lineTo(16.21 * s, 20.34 * s)
      ..lineTo(20.01 * s, 20.34 * s)
      ..cubicTo(22.24 * s, 18.25 * s, 23.52 * s, 15.35 * s, 23.52 * s, 12.27 * s)
      ..close();
    canvas.drawPath(bluePath, bluePaint);
    
    // Green
    final greenPaint = Paint()..color = const Color(0xFF34A853);
    final greenPath = Path()
      ..moveTo(12 * s, 24 * s)
      ..cubicTo(15.24 * s, 24 * s, 17.95 * s, 22.92 * s, 20.01 * s, 20.34 * s)
      ..lineTo(16.21 * s, 17.57 * s)
      ..cubicTo(15.2 * s, 18.25 * s, 13.91 * s, 18.66 * s, 12 * s, 18.66 * s)
      ..cubicTo(8.87 * s, 18.66 * s, 6.21 * s, 16.55 * s, 5.31 * s, 13.7 * s)
      ..lineTo(1.4 * s, 13.7 * s)
      ..lineTo(1.4 * s, 16.56 * s)
      ..cubicTo(3.43 * s, 20.63 * s, 7.45 * s, 24 * s, 12 * s, 24 * s)
      ..close();
    canvas.drawPath(greenPath, greenPaint);
    
    // Yellow
    final yellowPaint = Paint()..color = const Color(0xFFFBBC05);
    final yellowPath = Path()
      ..moveTo(5.31 * s, 13.7 * s)
      ..cubicTo(5.07 * s, 12.97 * s, 4.93 * s, 12.19 * s, 4.93 * s, 11.38 * s)
      ..cubicTo(4.93 * s, 10.57 * s, 5.07 * s, 9.79 * s, 5.31 * s, 9.06 * s)
      ..lineTo(5.31 * s, 6.2 * s)
      ..lineTo(1.4 * s, 6.2 * s)
      ..cubicTo(0.51 * s, 7.97 * s, 0 * s, 9.96 * s, 0 * s, 12 * s)
      ..cubicTo(0 * s, 14.04 * s, 0.51 * s, 16.03 * s, 1.4 * s, 17.8 * s)
      ..lineTo(5.31 * s, 13.7 * s)
      ..close();
    canvas.drawPath(yellowPath, yellowPaint);
    
    // Red
    final redPaint = Paint()..color = const Color(0xFFEA4335);
    final redPath = Path()
      ..moveTo(12 * s, 4.77 * s)
      ..cubicTo(14.05 * s, 4.77 * s, 15.89 * s, 5.47 * s, 17.32 * s, 6.83 * s)
      ..lineTo(20.08 * s, 4.07 * s)
      ..cubicTo(17.94 * s, 2.06 * s, 15.23 * s, 0.77 * s, 12 * s, 0.77 * s)
      ..cubicTo(7.45 * s, 0.77 * s, 3.43 * s, 4.14 * s, 1.4 * s, 8.2 * s)
      ..lineTo(5.31 * s, 11.06 * s)
      ..cubicTo(6.21 * s, 8.22 * s, 8.87 * s, 6.1 * s, 12 * s, 4.77 * s)
      ..close();
    canvas.drawPath(redPath, redPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
