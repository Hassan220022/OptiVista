import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/routing/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../cart/providers/cart_provider.dart';
import '../../providers/product_provider.dart';
import '../widgets/product_image_carousel.dart';
import '../widgets/add_to_cart_bar.dart';
import '../widgets/specs_section.dart';

class ProductDetailsScreen extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailsScreen({
    super.key,
    required this.productId,
  });

  @override
  ConsumerState<ProductDetailsScreen> createState() =>
      _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  bool _isAddingToCart = false;
  bool _isInWishlist = false;

  Future<void> _onAddToCart() async {
    final product = ref.read(productDetailsProvider(widget.productId)).value;
    if (product == null) return;

    setState(() => _isAddingToCart = true);

    try {
      await ref.read(cartProvider.notifier).addToCart(product);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${product.name} added to cart'),
            backgroundColor: AppColors.surface,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            action: SnackBarAction(
              label: 'View Cart',
              textColor: AppColors.primary,
              onPressed: () => context.go(RouteNames.cart),
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isAddingToCart = false);
      }
    }
  }

  void _onArTryOn() {
    context.pushNamed(
      RouteNames.arTryOnName,
      pathParameters: {'id': widget.productId},
    );
  }

  void _toggleWishlist() {
    setState(() => _isInWishlist = !_isInWishlist);
    // TODO: Implement wishlist functionality
  }

  @override
  Widget build(BuildContext context) {
    final productAsync = ref.watch(productDetailsProvider(widget.productId));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: productAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (err, stack) => _buildErrorState(err.toString()),
        data: (product) => Stack(
          children: [
            CustomScrollView(
              slivers: [
                // App bar
                SliverAppBar(
                  backgroundColor: AppColors.background,
                  expandedHeight: 320,
                  pinned: true,
                  actions: [
                    IconButton(
                      icon: Icon(
                        _isInWishlist ? Icons.favorite : Icons.favorite_border,
                        color: _isInWishlist ? Colors.red : null,
                      ),
                      onPressed: _toggleWishlist,
                    ),
                    IconButton(
                      icon: const Icon(Icons.share),
                      onPressed: () {
                        // TODO: Share functionality
                      },
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    background: ProductImageCarousel(
                      images: product.images,
                      hasArAsset: product.isVirtualTryOnEnabled,
                      onArTap: _onArTryOn,
                    ),
                  ),
                ),

                // Content
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Brand and name
                        Text(
                          product.brand,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          product.name,
                          style: AppTextStyles.headlineSmall.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Rating
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.amber.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.star,
                                    color: Colors.amber,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    product.rating.toStringAsFixed(1),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              '${product.reviewCount} reviews',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Description
                        Text(
                          'Description',
                          style: AppTextStyles.titleMedium.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          product.description,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                            height: 1.6,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Specifications
                        SpecsSection(
                          specs: {
                            'Material': product.frameMaterial.isNotEmpty ? product.frameMaterial : 'N/A',
                            'Frame Color': product.frameColor.isNotEmpty ? product.frameColor : 'N/A',
                            'Lens Color': product.lensColor.isNotEmpty ? product.lensColor : 'N/A',
                            'Style': product.style.isNotEmpty ? product.style : 'N/A',
                            'Gender': product.gender.isNotEmpty ? product.gender : 'Unisex',
                            'Face Shape': product.faceShape.isNotEmpty ? product.faceShape : 'All',
                            'Model': product.modelNumber,
                          },
                        ),
                        const SizedBox(height: 24),

                        // AR Try-On promo (if available)
                        if (product.isVirtualTryOnEnabled) ...[
                          _buildArPromoCard(),
                          const SizedBox(height: 24),
                        ],

                        // Bottom padding for the cart bar
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Add to cart bar
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: AddToCartBar(
                price: product.price.toDouble(),
                isArAvailable: product.isVirtualTryOnEnabled,
                isAddingToCart: _isAddingToCart,
                onArTryOn: _onArTryOn,
                onAddToCart: _onAddToCart,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildArPromoCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primary.withValues(alpha: 0.15),
            AppColors.secondary.withValues(alpha: 0.15),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.primary.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.view_in_ar,
              color: AppColors.primary,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Try Before You Buy',
                  style: AppTextStyles.titleSmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Use AR to see how these frames look on you',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: _onArTryOn,
            icon: const Icon(
              Icons.arrow_forward,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.error_outline,
                size: 48,
                color: AppColors.error,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Failed to load product',
              style: AppTextStyles.titleLarge.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                ref.invalidate(productDetailsProvider(widget.productId));
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Try Again'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
