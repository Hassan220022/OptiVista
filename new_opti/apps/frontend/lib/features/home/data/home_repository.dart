import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../catalog/domain/product_model.dart';

/// Home data model
class HomeData {
  final List<Product> featuredProducts;
  final List<Product> recommendedProducts;
  final String? bannerTitle;
  final String? bannerSubtitle;
  final String? bannerImageUrl;

  const HomeData({
    required this.featuredProducts,
    required this.recommendedProducts,
    this.bannerTitle,
    this.bannerSubtitle,
    this.bannerImageUrl,
  });
}

/// Repository for home screen data
class HomeRepository {
  final Dio _dio;

  HomeRepository(this._dio);

  /// Fetch all home screen data in one call
  Future<HomeData> getHomeData() async {
    try {
      // Fetch products and split them
      final response = await _dio.get('/products/', queryParameters: {
        'limit': 12,
      });

      final List<dynamic> items = response.data['items'] ?? [];
      final products = items.map((json) => Product.fromJson(json)).toList();

      // Split into featured (first 6) and recommended (rest)
      final featured = products.take(6).toList();
      final recommended = products.skip(6).take(6).toList();

      return HomeData(
        featuredProducts: featured,
        recommendedProducts: recommended,
      );
    } on DioException catch (e) {
      throw Exception('Failed to load home data: ${e.message}');
    }
  }

  /// Get featured products
  Future<List<Product>> getFeaturedProducts() async {
    try {
      final response = await _dio.get('/products/', queryParameters: {
        'limit': 6,
        'is_featured': true,
      });

      final List<dynamic> items = response.data['items'] ?? [];
      return items.map((json) => Product.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Failed to load featured products: ${e.message}');
    }
  }

  /// Get recommended products for user
  Future<List<Product>> getRecommendedProducts({String? userId}) async {
    try {
      final response = await _dio.get('/products/', queryParameters: {
        'limit': 6,
        'sort_by': 'rating',
      });

      final List<dynamic> items = response.data['items'] ?? [];
      return items.map((json) => Product.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Failed to load recommended products: ${e.message}');
    }
  }
}

/// Home repository provider
final homeRepositoryProvider = Provider<HomeRepository>((ref) {
  final dio = ref.watch(apiClientProvider);
  return HomeRepository(dio);
});

/// Home data provider
final homeDataProvider = FutureProvider<HomeData>((ref) async {
  final repository = ref.watch(homeRepositoryProvider);
  return repository.getHomeData();
});