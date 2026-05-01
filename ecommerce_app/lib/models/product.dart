class Product {
  final int id;
  final String name;
  final String category;
  final double price;
  final String? imageUrl;
  final bool isFeatured;
  final bool isBestSeller;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    this.imageUrl,
    required this.isFeatured,
    required this.isBestSeller,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String,
      category: json['category'] as String,
      price: (json['price'] as num).toDouble(),
      imageUrl: json['image_url'] as String?,
      isFeatured: json['is_featured'] as bool? ?? false,
      isBestSeller: json['is_best_seller'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'price': price,
      'image_url': imageUrl,
      'is_featured': isFeatured,
      'is_best_seller': isBestSeller,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
