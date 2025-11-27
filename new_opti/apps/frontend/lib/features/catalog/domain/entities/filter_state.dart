/// Filter state for catalog products
class CatalogFilterState {
  final List<String> shapes;
  final List<String> colors;
  final List<String> brands;
  final String? gender;
  final double? minPrice;
  final double? maxPrice;
  final bool arOnly;
  final String? searchQuery;
  final SortOption sortBy;

  const CatalogFilterState({
    this.shapes = const [],
    this.colors = const [],
    this.brands = const [],
    this.gender,
    this.minPrice,
    this.maxPrice,
    this.arOnly = false,
    this.searchQuery,
    this.sortBy = SortOption.newest,
  });

  CatalogFilterState copyWith({
    List<String>? shapes,
    List<String>? colors,
    List<String>? brands,
    String? gender,
    double? minPrice,
    double? maxPrice,
    bool? arOnly,
    String? searchQuery,
    SortOption? sortBy,
  }) {
    return CatalogFilterState(
      shapes: shapes ?? this.shapes,
      colors: colors ?? this.colors,
      brands: brands ?? this.brands,
      gender: gender ?? this.gender,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      arOnly: arOnly ?? this.arOnly,
      searchQuery: searchQuery ?? this.searchQuery,
      sortBy: sortBy ?? this.sortBy,
    );
  }

  /// Check if any filters are active
  bool get hasActiveFilters =>
      shapes.isNotEmpty ||
      colors.isNotEmpty ||
      brands.isNotEmpty ||
      gender != null ||
      minPrice != null ||
      maxPrice != null ||
      arOnly;

  /// Get count of active filters
  int get activeFilterCount {
    int count = 0;
    if (shapes.isNotEmpty) count++;
    if (colors.isNotEmpty) count++;
    if (brands.isNotEmpty) count++;
    if (gender != null) count++;
    if (minPrice != null || maxPrice != null) count++;
    if (arOnly) count++;
    return count;
  }

  /// Clear all filters
  CatalogFilterState clearAll() {
    return CatalogFilterState(
      searchQuery: searchQuery,
      sortBy: sortBy,
    );
  }

  /// Convert to API query parameters
  Map<String, dynamic> toQueryParameters() {
    final params = <String, dynamic>{};
    
    if (shapes.isNotEmpty) params['shapes'] = shapes.join(',');
    if (colors.isNotEmpty) params['colors'] = colors.join(',');
    if (brands.isNotEmpty) params['brands'] = brands.join(',');
    if (gender != null) params['gender'] = gender;
    if (minPrice != null) params['min_price'] = (minPrice! * 100).toInt();
    if (maxPrice != null) params['max_price'] = (maxPrice! * 100).toInt();
    if (arOnly) params['ar_enabled'] = true;
    if (searchQuery != null && searchQuery!.isNotEmpty) {
      params['search'] = searchQuery;
    }
    params['sort_by'] = sortBy.apiValue;
    
    return params;
  }
}

/// Sort options for catalog
enum SortOption {
  newest('Newest', 'created_at_desc'),
  priceLowest('Price: Low to High', 'price_asc'),
  priceHighest('Price: High to Low', 'price_desc'),
  rating('Highest Rated', 'rating_desc'),
  popular('Most Popular', 'popularity_desc');

  final String label;
  final String apiValue;

  const SortOption(this.label, this.apiValue);
}

/// Available filter options from API
class FilterOptions {
  final List<String> shapes;
  final List<String> colors;
  final List<String> brands;
  final List<String> genders;
  final double minPrice;
  final double maxPrice;

  const FilterOptions({
    this.shapes = const [],
    this.colors = const [],
    this.brands = const [],
    this.genders = const ['Men', 'Women', 'Unisex'],
    this.minPrice = 0,
    this.maxPrice = 1000,
  });

  factory FilterOptions.defaults() {
    return const FilterOptions(
      shapes: ['Round', 'Square', 'Aviator', 'Cat-eye', 'Rectangle', 'Oval'],
      colors: ['Black', 'Brown', 'Gold', 'Silver', 'Tortoise', 'Blue', 'Red'],
      brands: ['Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Versace'],
      genders: ['Men', 'Women', 'Unisex'],
      minPrice: 0,
      maxPrice: 500,
    );
  }
}
