# E-Commerce Flutter App

A Flutter-based e-commerce application with 3 main screens: Marketplace, Login/Signup, and Payment. Data is stored in PostgreSQL and accessed via Node.js/Express API.

## Project Structure

```
ecommerce_app/
├── lib/
│   ├── models/
│   │   ├── product.dart
│   │   ├── user.dart
│   │   └── order.dart
│   ├── services/
│   │   └── api_service.dart
│   ├── pages/
│   │   ├── marketplace_page.dart
│   │   ├── login_page.dart
│   │   └── payment_page.dart
│   ├── providers/
│   │   └── app_provider.dart
│   └── main.dart
└── pubspec.yaml
```

## Prerequisites

- Flutter SDK installed
- Node.js and npm installed
- PostgreSQL database running
- Backend server running (Node.js API)

## Setup Instructions

### 1. Backend Setup

Navigate to the backend folder and start the server:

```bash
cd ../lab-12
npm install
node server.js
```

The backend API will run on `http://localhost:3000`

### 2. Database Setup

Ensure PostgreSQL is running with the following credentials:
- Host: localhost
- Port: 5433
- Database: CSS312
- User: postgres
- Password: 123

Tables will be created automatically on first server run.

### 3. Flutter App Setup

```bash
cd ecommerce_app
cd c:\Users\MU302-07\Documents\GitHub\CSS312\lab-12
npm install
node server.js

# Terminal 2: Start Flutter app
cd c:\Users\MU302-07\Documents\GitHub\CSS312\ecommerce_app
flutter pub get
flutter run
```

## Features

### 📱 Marketplace Page
- Browse featured products
- View best sellers
- Search functionality
- Product cards with images and prices

### 🔐 Login/Signup Page
- User authentication
- Registration form
- Login form
- Toggle between signin/signup

### 💳 Payment Page
- Card details entry
- Real-time card display
- Order summary with calculations
- Payment processing

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get best sellers
- `POST /api/products` - Create product

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order

## Dependencies

- `http: ^1.1.0` - HTTP client for API calls
- `provider: ^6.1.0` - State management
- `intl: ^0.19.0` - Internationalization

## Navigation

Use the bottom navigation dots and arrow buttons to navigate between the three pages:
- Page 1: Marketplace
- Page 2: Login
- Page 3: Payment

## Sample Data

To test the app, you can insert sample data into PostgreSQL:

```sql
INSERT INTO products (name, category, price, image_url, is_featured, is_best_seller) VALUES
('Premium Headphones', 'Electronics', 99.99, null, true, true),
('Wireless Mouse', 'Electronics', 29.99, null, true, false),
('USB Cable', 'Accessories', 9.99, null, false, true),
('Phone Case', 'Accessories', 19.99, null, true, true);
```

## Testing

1. Start the backend server
2. Run `flutter run`
3. Navigate through the pages
4. Test signup/login functionality
5. Test payment processing

