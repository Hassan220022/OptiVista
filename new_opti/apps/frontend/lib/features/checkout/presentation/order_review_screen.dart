import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../orders/data/order_repository.dart';
import '../../cart/providers/cart_provider.dart';

class OrderReviewScreen extends ConsumerWidget {
  const OrderReviewScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartItems = ref.watch(cartProvider);
    final cartTotal = ref.watch(cartTotalProvider);
    final shippingCost = 10.0; // Mock shipping cost
    final total = cartTotal + shippingCost;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Review Order'),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Shipping Address'),
                  const SizedBox(height: 8),
                  _buildInfoCard(
                    icon: Icons.location_on_outlined,
                    title: 'John Doe',
                    subtitle:
                        '123 Main St, Apt 4B\nNew York, NY 10001\n+1 234 567 8900',
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Payment Method'),
                  const SizedBox(height: 8),
                  _buildInfoCard(
                    icon: Icons.credit_card,
                    title: 'Credit Card',
                    subtitle: '**** **** **** 1234',
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Order Items'),
                  const SizedBox(height: 8),
                  cartItems.when(
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (err, stack) => Text('Error: $err'),
                    data: (items) => Column(
                      children: items
                          .map((item) => Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 60,
                                      height: 60,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.05),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: item.product.images.isNotEmpty
                                          ? ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              child: Image.network(
                                                item.product.images.first,
                                                fit: BoxFit.cover,
                                              ),
                                            )
                                          : const Icon(Icons.image,
                                              color: Colors.white54),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.product.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          Text(
                                            'Qty: ${item.quantity}',
                                            style: TextStyle(
                                              color:
                                                  Colors.white.withOpacity(0.6),
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      '\$${item.totalPrice.toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Divider(color: Colors.white24),
                  const SizedBox(height: 16),
                  _buildSummaryRow('Subtotal', cartTotal),
                  const SizedBox(height: 8),
                  _buildSummaryRow('Shipping', shippingCost),
                  const SizedBox(height: 16),
                  _buildSummaryRow('Total', total, isTotal: true),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Color(0xFF1E1E1E),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  offset: Offset(0, -5),
                ),
              ],
            ),
            child: AppButton(
              text: 'Place Order',
              onPressed: () async {
                try {
                  // Show loading indicator (simple version for now)
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (c) =>
                        const Center(child: CircularProgressIndicator()),
                  );

                  // Create order
                  final order =
                      await ref.read(orderRepositoryProvider).createOrder(
                    shippingAddress: {
                      'name':
                          'John Doe', // Mock data for now, should come from provider
                      'line1': '123 Main St',
                      'city': 'New York',
                      'state': 'NY',
                      'postal_code': '10001',
                      'country': 'US',
                    },
                    paymentProvider: 'stripe',
                  );

                  // Clear cart
                  ref.read(cartProvider.notifier).clearCart();

                  if (context.mounted) {
                    // Dismiss loading
                    Navigator.of(context).pop();
                    // Go to confirmation
                    context.goNamed('confirmation',
                        pathParameters: {'id': order.id});
                  }
                } catch (e) {
                  if (context.mounted) {
                    Navigator.of(context).pop(); // Dismiss loading
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to place order: $e')),
                    );
                  }
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: Colors.white70,
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white70),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, double amount, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 18 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? Colors.white : Colors.white70,
          ),
        ),
        Text(
          '\$${amount.toStringAsFixed(2)}',
          style: TextStyle(
            fontSize: isTotal ? 18 : 14,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? Colors.white : Colors.white70,
          ),
        ),
      ],
    );
  }
}
