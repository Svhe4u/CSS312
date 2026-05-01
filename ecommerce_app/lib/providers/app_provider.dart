import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/product.dart';
import '../models/order.dart';
import '../services/api_service.dart';

class AppProvider with ChangeNotifier {
  User? _currentUser;
  List<Product> _products = [];
  List<Product> _featuredProducts = [];
  List<Product> _bestSellerProducts = [];
  List<Order> _orders = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  User? get currentUser => _currentUser;
  List<Product> get products => _products;
  List<Product> get featuredProducts => _featuredProducts;
  List<Product> get bestSellerProducts => _bestSellerProducts;
  List<Order> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load Products
  Future<void> loadProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _products = await ApiService.getProducts();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load Featured Products
  Future<void> loadFeaturedProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _featuredProducts = await ApiService.getFeaturedProducts();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load Best Seller Products
  Future<void> loadBestSellerProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _bestSellerProducts = await ApiService.getBestSellerProducts();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Register User
  Future<bool> registerUser(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _currentUser = await ApiService.registerUser(name, email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Login User
  Future<bool> loginUser(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _currentUser = await ApiService.loginUser(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Logout
  void logout() {
    _currentUser = null;
    notifyListeners();
  }

  // Create Order
  Future<bool> createOrder(Order order) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final newOrder = await ApiService.createOrder(order);
      _orders.add(newOrder);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load Orders
  Future<void> loadOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _orders = await ApiService.getOrders();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Clear Error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
