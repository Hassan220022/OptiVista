import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/routing/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';

/// Provider to track onboarding completion
final hasCompletedOnboardingProvider = FutureProvider<bool>((ref) async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getBool('has_completed_onboarding') ?? false;
});

/// Onboarding step data model
class OnboardingStep {
  final String title;
  final String description;
  final IconData icon;
  final Color iconColor;

  const OnboardingStep({
    required this.title,
    required this.description,
    required this.icon,
    this.iconColor = AppColors.primary,
  });
}

/// Main onboarding screen with paged slides
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingStep> _steps = const [
    OnboardingStep(
      title: 'Welcome to OptiVista',
      description:
          'Discover the future of eyewear shopping with our revolutionary AR technology.',
      icon: Icons.visibility,
    ),
    OnboardingStep(
      title: 'Try Before You Buy',
      description:
          'Use augmented reality to see how glasses look on your face before making a purchase.',
      icon: Icons.view_in_ar,
      iconColor: Colors.purple,
    ),
    OnboardingStep(
      title: 'Perfect Fit Guaranteed',
      description:
          'Adjust and customize the fit to find glasses that match your style perfectly.',
      icon: Icons.tune,
      iconColor: Colors.orange,
    ),
    OnboardingStep(
      title: 'Ready to Explore?',
      description:
          'Browse our curated collection of premium eyewear from top brands worldwide.',
      icon: Icons.explore,
      iconColor: Colors.green,
    ),
  ];

  bool get isLastPage => _currentPage == _steps.length - 1;

  void _nextPage() {
    if (isLastPage) {
      _completeOnboarding();
    } else {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _skipOnboarding() {
    _completeOnboarding();
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('has_completed_onboarding', true);
    if (mounted) {
      context.go(RouteNames.signIn);
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
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
              Color(0xFF1A1A2E),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Skip button
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextButton(
                    onPressed: _skipOnboarding,
                    child: Text(
                      'Skip',
                      style: AppTextStyles.labelLarge.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
              // Page content
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  itemCount: _steps.length,
                  itemBuilder: (context, index) {
                    return _OnboardingPage(step: _steps[index]);
                  },
                ),
              ),
              // Page indicator
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    _steps.length,
                    (index) => _PageIndicatorDot(
                      isActive: index == _currentPage,
                    ),
                  ),
                ),
              ),
              // Action buttons
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
                child: AppButton(
                  text: isLastPage ? 'GET STARTED' : 'NEXT',
                  onPressed: _nextPage,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Individual onboarding page
class _OnboardingPage extends StatelessWidget {
  final OnboardingStep step;

  const _OnboardingPage({required this.step});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon container with gradient background
          Container(
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  step.iconColor.withOpacity(0.3),
                  step.iconColor.withOpacity(0.1),
                ],
              ),
              border: Border.all(
                color: step.iconColor.withOpacity(0.5),
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  color: step.iconColor.withOpacity(0.2),
                  blurRadius: 30,
                  spreadRadius: 10,
                ),
              ],
            ),
            child: Icon(
              step.icon,
              size: 80,
              color: step.iconColor,
            ),
          ),
          const SizedBox(height: 48),
          // Title
          Text(
            step.title,
            style: AppTextStyles.displaySmall.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          // Description
          Text(
            step.description,
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textSecondary,
              height: 1.6,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

/// Page indicator dot
class _PageIndicatorDot extends StatelessWidget {
  final bool isActive;

  const _PageIndicatorDot({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      width: isActive ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}
