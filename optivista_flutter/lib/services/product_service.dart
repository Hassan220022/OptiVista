import '../models/product.dart';
import 'api_service.dart';

class ProductService {
  final ApiService _apiService = ApiService();

  // Fetch all products
  Future<List<Product>> fetchAllProducts() async {
    final response = await _apiService.get('/products/');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<Product> products =
          data.map((item) => Product.fromJson(item)).toList();
      return products;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch products');
    }
  }

  // Fetch a single product by ID
  Future<Product> fetchProductById(int id) async {
    final response = await _apiService.get('/products/$id');

    if (response['success']) {
      Product product = Product.fromJson(response['data']);
      return product;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch product');
    }
  }

  // Update product stock
  Future<void> updateStock(int id, int stock) async {
    final data = {
      'stock': stock,
    };

    final response = await _apiService.put('/products/$id/stock', data);

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to update stock');
    }
  }
}
