class Order {
  final int id;
  final int? userId;
  final String cardNumber;
  final String cardHolder;
  final String expiry;
  final double amount;
  final String status;
  final DateTime createdAt;

  Order({
    required this.id,
    this.userId,
    required this.cardNumber,
    required this.cardHolder,
    required this.expiry,
    required this.amount,
    required this.status,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as int,
      userId: json['user_id'] as int?,
      cardNumber: json['card_number'] as String,
      cardHolder: json['card_holder'] as String,
      expiry: json['expiry'] as String,
      amount: (json['amount'] as num).toDouble(),
      status: json['status'] as String? ?? 'pending',
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'card_number': cardNumber,
      'card_holder': cardHolder,
      'expiry': expiry,
      'amount': amount,
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
