import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/product_model.dart';
import '../../domain/entities/filter_state.dart';

/// Catalog screen state
class CatalogState {
  final bool isLoading;
  final bool isLoadingMore;
  final bool isRefreshing;
  final List<Product> products;
  final CatalogFilterState filters;
  final int currentPage;
  final bool hasMore;
  final int totalCount;
  final String? errorMessage;

  const CatalogState({
    this.isLoading = true,
    this.isLoadingMore = false,
    this.isRefreshing = false,
    this.products = const [],
    this.filters = const CatalogFilterState(),
    this.currentPage = 1,
    this.hasMore = true,
    this.totalCount = 0,
    this.errorMessage,
  });

  CatalogState copyWith({
    bool? isLoading,
    bool? isLoadingMore,
    bool? isRefreshing,
    List<Product>? products,
    CatalogFilterState? filters,
    int? currentPage,
    bool? hasMore,
    int? totalCount,
    String? errorMessage,
  }) {
    return CatalogState(
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      products: products ?? this.products,
      filters: filters ?? this.filters,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      totalCount: totalCount ?? this.totalCount,
      errorMessage: errorMessage,
    );
  }
}

/// Catalog controller
class CatalogController extends StateNotifier<CatalogState> {
  final Dio _dio;
  Timer? _searchDebounce;
  static const int _pageSize = 20;

  CatalogController(this._dio) : super(const CatalogState()) {
    loadInitialProducts();
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    super.dispose();
  }

  /// Load initial products
  Future<void> loadInitialProducts() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final response = await _fetchProducts(page: 1);
      state = state.copyWith(
        isLoading: false,
        products: response.products,
        currentPage: 1,
        hasMore: response.hasMore,
        totalCount: response.totalCount,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load products. Please try again.',
      );
    }
  }

  /// Load more products (pagination)
  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;

    state = state.copyWith(isLoadingMore: true);

    try {
      final nextPage = state.currentPage + 1;
      final response = await _fetchProducts(page: nextPage);
      
      state = state.copyWith(
        isLoadingMore: false,
        products: [...state.products, ...response.products],
        currentPage: nextPage,
        hasMore: response.hasMore,
        totalCount: response.totalCount,
      );
    } catch (e) {
      state = state.copyWith(isLoadingMore: false);
    }
  }

  /// Pull-to-refresh
  Future<void> refresh() async {
    state = state.copyWith(isRefreshing: true);

    try {
      final response = await _fetchProducts(page: 1);
      state = state.copyWith(
        isRefreshing: false,
        products: response.products,
        currentPage: 1,
        hasMore: response.hasMore,
        totalCount: response.totalCount,
      );
    } catch (e) {
      state = state.copyWith(isRefreshing: false);
    }
  }

  /// Set search query with debounce
  void setSearchQuery(String query) {
    _searchDebounce?.cancel();
    _searchDebounce = Timer(const Duration(milliseconds: 300), () {
      state = state.copyWith(
        filters: state.filters.copyWith(searchQuery: query.isEmpty ? null : query),
      );
      loadInitialProducts();
    });
  }

  /// Apply new filters
  void applyFilters(CatalogFilterState newFilters) {
    state = state.copyWith(filters: newFilters);
    loadInitialProducts();
  }

  /// Clear all filters
  void clearFilters() {
    state = state.copyWith(filters: state.filters.clearAll());
    loadInitialProducts();
  }

  /// Set sort option
  void setSortOption(SortOption option) {
    state = state.copyWith(
      filters: state.filters.copyWith(sortBy: option),
    );
    loadInitialProducts();
  }

  /// Toggle AR only filter
  void toggleArOnly() {
    state = state.copyWith(
      filters: state.filters.copyWith(arOnly: !state.filters.arOnly),
    );
    loadInitialProducts();
  }

  /// Fetch products from API
  Future<_ProductsResponse> _fetchProducts({required int page}) async {
    final params = state.filters.toQueryParameters();
    params['page'] = page;
    params['limit'] = _pageSize;

    final response = await _dio.get('/products/', queryParameters: params);

    final List<dynamic> items = response.data['items'] ?? [];
    final products = items.map((json) => Product.fromJson(json)).toList();
    final totalCount = response.data['total'] ?? items.length;
    final hasMore = items.length >= _pageSize;

    return _ProductsResponse(
      products: products,
      totalCount: totalCount,
      hasMore: hasMore,
    );
  }
}

class _ProductsResponse {
  final List<Product> products;
  final int totalCount;
  final bool hasMore;

  _ProductsResponse({
    required this.products,
    required this.totalCount,
    required this.hasMore,
  });
}

/// Catalog controller provider
final catalogControllerProvider =
    StateNotifierProvider<CatalogController, CatalogState>((ref) {
  final dio = ref.watch(apiClientProvider);
  return CatalogController(dio);
});

/// Filter options provider
final filterOptionsProvider = Provider<FilterOptions>((ref) {
  return FilterOptions.defaults();
});
