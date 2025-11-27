class Product {
  final String id;
  final String name;
  final String description;
  final int price;
  final String currency;
  final String brand;
  final String modelNumber;
  final String frameColor;
  final String lensColor;
  final String frameMaterial;
  final String style;
  final String gender;
  final String faceShape;
  final List<String> images;
  final bool isVirtualTryOnEnabled;
  final double rating;
  final int reviewCount;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.brand,
    required this.modelNumber,
    required this.frameColor,
    required this.lensColor,
    required this.frameMaterial,
    required this.style,
    required this.gender,
    required this.faceShape,
    required this.images,
    required this.isVirtualTryOnEnabled,
    required this.rating,
    required this.reviewCount,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    // Handle images: prefer 'images' list, fallback to 'thumbnail_url' wrapped in list
    List<String> imagesList = [];
    if (json['images'] != null) {
      imagesList = List<String>.from(json['images']);
    } else if (json['thumbnail_url'] != null) {
      imagesList = [json['thumbnail_url']];
    }

    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? '',
      price: json['price_cents'] ?? json['price'] ?? 0,
      currency: json['currency_code'] ?? json['currency'] ?? 'USD',
      brand: json['brand'] ?? 'Unknown Brand',
      modelNumber: json['slug'] ?? json['model_number'] ?? 'N/A',
      frameColor: json['frame_color'] ?? '',
      lensColor: json['lens_color'] ?? '',
      frameMaterial: json['frame_material'] ?? '',
      style: json['style'] ?? '',
      gender: json['gender'] ?? '',
      faceShape: json['face_shape'] ?? '',
      images: imagesList,
      isVirtualTryOnEnabled: json['is_virtual_try_on_enabled'] ?? false,
      rating: (json['avg_rating'] ?? json['rating'] ?? 0.0).toDouble(),
      reviewCount: json['review_count'] ?? 0,
    );
  }
}
