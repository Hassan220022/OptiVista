# OptiVista API

Backend API service for OptiVista, an augmented reality shopping platform.

## Features

- User authentication and authorization with JWT
- Product management with AR model support
- Order processing and management
- User reviews and feedback
- File storage with MinIO (S3-compatible)
- MySQL database integration

## Prerequisites

- Node.js >= 16.0.0
- MySQL >= 8.0
- MinIO server (or any S3-compatible storage)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/optivista-backend.git
cd optivista-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Then edit `.env` file with your configuration details.

4. Set up the database
```bash
# Create a MySQL database named 'optivista'
# The tables will be automatically created when the app starts
```

5. Start MinIO server (if using locally)
```bash
# Follow MinIO documentation to set up a local server
# https://docs.min.io/docs/minio-quickstart-guide.html
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change user password
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/user/:id` - Get user's order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Feedback/Reviews
- `GET /api/feedback` - Get all feedback (admin only)
- `GET /api/feedback/product/:productId` - Get product feedback
- `GET /api/feedback/user` - Get user's feedback
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

## Documentation

Detailed API documentation is available at `/api-docs` when the server is running.

## Testing

Run the test suite with:
```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 