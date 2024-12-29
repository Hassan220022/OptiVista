import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/product_service.dart';

class ProductProvider with ChangeNotifier {
  final ProductService _productService = ProductService();

  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Fetch all products
  Future<void> fetchAllProducts() async {
    _isLoading = true;
    notifyListeners();

    try {
      _products = await _productService.fetchAllProducts();
      _error = null;
    } catch (e) {
      _error = e.toString();
      _products = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  // Fetch a single product by ID
  Future<Product?> fetchProductById(int id) async {
    try {
      Product product = await _productService.fetchProductById(id);
      return product;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  // Update product stock
  // Future<bool> updateProductStock(int id, int stock) async {
  //   try {
  //     await _productService.updateStock(id, stock);
  //     // Update local product list if necessary
  //     int index = _products.indexWhere((product) => product.id == id);
  //     if (index != -1) {
  //       _products[index].stock = stock;
  //       notifyListeners();
  //     }
  //     return true;
  //   } catch (e) {
  //     _error = e.toString();
  //     notifyListeners();
  //     return false;
  //   }
  // }
}
