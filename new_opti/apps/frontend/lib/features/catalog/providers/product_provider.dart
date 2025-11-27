import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import '../domain/product_model.dart';

// Filter State
class ProductFilterState {
  final String? category;
  final String? gender;
  final int? minPrice;
  final int? maxPrice;
  final String? search;

  const ProductFilterState({
    this.category,
    this.gender,
    this.minPrice,
    this.maxPrice,
    this.search,
  });

  ProductFilterState copyWith({
    String? category,
    String? gender,
    int? minPrice,
    int? maxPrice,
    String? search,
  }) {
    return ProductFilterState(
      category: category ?? this.category,
      gender: gender ?? this.gender,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      search: search ?? this.search,
    );
  }

  Map<String, dynamic> toQueryParameters() {
    final params = <String, dynamic>{};
    if (category != null) params['category'] = category;
    if (gender != null) params['gender'] = gender;
    if (minPrice != null) params['min_price'] = minPrice;
    if (maxPrice != null) params['max_price'] = maxPrice;
    if (search != null && search!.isNotEmpty) params['search'] = search;
    return params;
  }
}

// Providers
final productFilterProvider = StateProvider<ProductFilterState>((ref) {
  return const ProductFilterState();
});

final productsProvider = FutureProvider.autoDispose<List<Product>>((ref) async {
  final dio = ref.watch(apiClientProvider);
  final filters = ref.watch(productFilterProvider);

  try {
    final response = await dio.get(
      '/products/',
      queryParameters: filters.toQueryParameters(),
    );

    final List<dynamic> items = response.data['items'];
    return items.map((json) => Product.fromJson(json)).toList();
  } on DioException catch (e) {
    // Handle error appropriately
    throw Exception(e.message);
  }
});

final productDetailsProvider =
    FutureProvider.family<Product, String>((ref, id) async {
  final dio = ref.watch(apiClientProvider);
  try {
    final response = await dio.get('/products/$id');
    return Product.fromJson(response.data);
  } on DioException catch (e) {
    throw Exception(e.message);
  }
});
