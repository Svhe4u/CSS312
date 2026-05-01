import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/product.dart';
import '../models/user.dart';
import '../models/order.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // PRODUCTS
  static Future<List<Product>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => Product.fromJson(json)).toList();
      }
      throw Exception('Failed to load products');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<List<Product>> getFeaturedProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products/featured'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => Product.fromJson(json)).toList();
      }
      throw Exception('Failed to load featured products');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<List<Product>> getBestSellerProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products/bestsellers'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => Product.fromJson(json)).toList();
      }
      throw Exception('Failed to load best sellers');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<Product> createProduct(Product product) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/products'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(product.toJson()),
      );
      if (response.statusCode == 201) {
        return Product.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to create product');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // USERS
  static Future<User> registerUser(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );
      if (response.statusCode == 201) {
        return User.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to register');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<User> loginUser(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      }
      throw Exception('Invalid credentials');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // ORDERS
  static Future<List<Order>> getOrders() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => Order.fromJson(json)).toList();
      }
      throw Exception('Failed to load orders');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<Order> createOrder(Order order) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(order.toJson()),
      );
      if (response.statusCode == 201) {
        return Order.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to create order');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
