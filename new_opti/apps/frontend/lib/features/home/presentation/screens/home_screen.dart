import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/routing/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../catalog/providers/product_provider.dart';
import '../controllers/home_controller.dart';
import '../widgets/category_chip_row.dart';
import '../widgets/featured_product_carousel.dart';
import '../widgets/home_greeting.dart';
import '../widgets/home_hero_banner.dart';
import '../widgets/home_search_bar.dart';
import '../widgets/quick_action_row.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String? _selectedCategory;

  @override
  Widget build(BuildContext context) {
    final homeState = ref.watch(homeControllerProvider);
    final cartCount = ref.watch(homeCartCountProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(homeControllerProvider.notifier).refresh();
        },
        color: AppColors.primary,
        backgroundColor: AppColors.surface,
        child: CustomScrollView(
          slivers: [
            // Safe area spacer
            SliverToBoxAdapter(
              child: SizedBox(height: MediaQuery.of(context).padding.top + 8),
            ),

            // Greeting header
            SliverToBoxAdapter(
              child: HomeGreeting(
                userName: homeState.userName,
                cartItemCount: cartCount,
                onProfileTap: () => context.go(RouteNames.profile),
                onCartTap: () => context.go(RouteNames.cart),
              ),
            ),

            // Search bar
            SliverToBoxAdapter(
              child: HomeSearchBar(
                onTap: () => context.go(RouteNames.catalog),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 24)),

            // Hero banner
            SliverToBoxAdapter(
              child: HomeHeroBanner.arTryOn(
                onTap: () => context.go(RouteNames.catalog),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 28)),

            // Category chips
            SliverToBoxAdapter(
              child: CategoryChipRow(
                categories: CategoryChipRow.defaultCategories,
                selectedCategoryId: _selectedCategory,
                onCategorySelected: (category) {
                  setState(() => _selectedCategory = category.id);
                  _navigateToCatalogWithCategory(category.id);
                },
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 28)),

            // Quick actions
            SliverToBoxAdapter(
              child: QuickActionRow(
                actions: QuickActionRow.defaultActions,
                onActionTap: _handleQuickAction,
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 28)),

            // Featured products
            if (homeState.isLoading)
              const SliverToBoxAdapter(
                child: _LoadingSection(title: 'Featured'),
              )
            else if (homeState.errorMessage != null)
              SliverToBoxAdapter(
                child: _ErrorSection(
                  message: homeState.errorMessage!,
                  onRetry: () =>
                      ref.read(homeControllerProvider.notifier).loadHomeData(),
                ),
              )
            else
              SliverToBoxAdapter(
                child: FeaturedProductCarousel(
                  title: 'Featured',
                  products: homeState.featuredProducts,
                  onSeeAllTap: () => context.go(RouteNames.catalog),
                  onProductTap: (product) {
                    context.pushNamed(
                      RouteNames.productDetailsName,
                      pathParameters: {'id': product.id},
                    );
                  },
                  onArTryOnTap: (product) {
                    context.pushNamed(
                      RouteNames.arTryOnName,
                      pathParameters: {'id': product.id},
                    );
                  },
                ),
              ),

            const SliverToBoxAdapter(child: SizedBox(height: 28)),

            // Recommended products
            if (!homeState.isLoading && homeState.recommendedProducts.isNotEmpty)
              SliverToBoxAdapter(
                child: FeaturedProductCarousel(
                  title: 'Recommended For You',
                  products: homeState.recommendedProducts,
                  showSeeAll: false,
                  onProductTap: (product) {
                    context.pushNamed(
                      RouteNames.productDetailsName,
                      pathParameters: {'id': product.id},
                    );
                  },
                  onArTryOnTap: (product) {
                    context.pushNamed(
                      RouteNames.arTryOnName,
                      pathParameters: {'id': product.id},
                    );
                  },
                ),
              ),

            // Bottom padding
            SliverToBoxAdapter(
              child: SizedBox(
                height: MediaQuery.of(context).padding.bottom + 100,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToCatalogWithCategory(String categoryId) {
    if (categoryId == 'all') {
      // Clear filters and go to catalog
      ref.read(productFilterProvider.notifier).state =
          const ProductFilterState();
    } else {
      // Set category filter
      ref.read(productFilterProvider.notifier).state = ProductFilterState(
        gender: categoryId == 'men' || categoryId == 'women' || categoryId == 'unisex'
            ? categoryId
            : null,
        category: categoryId == 'sunglasses' || categoryId == 'optical' || categoryId == 'sport'
            ? categoryId
            : null,
      );
    }
    context.go(RouteNames.catalog);
  }

  void _handleQuickAction(QuickAction action) {
    switch (action.id) {
      case 'browse':
        context.go(RouteNames.catalog);
        break;
      case 'ar_tryon':
        context.go(RouteNames.catalog);
        break;
      case 'orders':
        context.go('${RouteNames.profile}/orders');
        break;
    }
  }
}

/// Loading skeleton for product sections
class _LoadingSection extends StatelessWidget {
  final String title;

  const _LoadingSection({required this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            title,
            style: AppTextStyles.titleLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 240,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: 3,
            separatorBuilder: (_, __) => const SizedBox(width: 16),
            itemBuilder: (context, index) => _buildSkeletonCard(),
          ),
        ),
      ],
    );
  }

  Widget _buildSkeletonCard() {
    return Container(
      width: 170,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.surfaceLight,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: Center(
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.primary.withOpacity(0.5),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 12,
                  width: 60,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  height: 14,
                  width: 100,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  height: 16,
                  width: 50,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Error section with retry button
class _ErrorSection extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const _ErrorSection({
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.error.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(
            Icons.error_outline,
            color: AppColors.error,
            size: 48,
          ),
          const SizedBox(height: 12),
          Text(
            message,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
