# API Documentation

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-production-url.com/api`

---

## Authentication APIs

### 1. **Login**
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "your.jwt.token"
  }
  ```
- **Errors**:
  - `400`: Invalid email or password.

---

### 2. **Register**
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "user@example.com",
    "password": "StrongPassword123",
    "role": "customer"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "user@example.com",
      "role": "customer"
    }
  }
  ```
- **Errors**:
  - `400`: Validation error (e.g., weak password, email already exists).

---

## Product APIs

### 3. **Get All Products**
- **Endpoint**: `GET /products`
- **Description**: Retrieves all products.
- **Response**:
  ```json
  {
    "success": true,
    "products": [
      {
        "id": 1,
        "name": "Classic Aviator",
        "price": 99.99,
        "description": "Classic aviator sunglasses"
      },
      ...
    ]
  }
  ```
- **Errors**:
  - `500`: Internal server error.

---

### 4. **Get Product By ID**
- **Endpoint**: `GET /products/:id`
- **Description**: Retrieves details of a specific product.
- **Response**:
  ```json
  {
    "success": true,
    "product": {
      "id": 1,
      "name": "Classic Aviator",
      "price": 99.99,
      "description": "Classic aviator sunglasses"
    }
  }
  ```
- **Errors**:
  - `404`: Product not found.

---

## Order APIs

### 5. **Create Order**
- **Endpoint**: `POST /orders`
- **Description**: Creates a new order.
- **Request Body**:
  ```json
  {
    "userId": 1,
    "items": [
      { "productId": 1, "quantity": 2, "price": 99.99 }
    ],
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "orderId": 123
  }
  ```
- **Errors**:
  - `400`: Invalid request body.

---

### 6. **Get Orders By User**
- **Endpoint**: `GET /orders/:userId`
- **Description**: Retrieves orders for a specific user.
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": 1,
        "status": "pending",
        "totalPrice": 199.98,
        "shippingAddress": "123 Main St"
      },
      ...
    ]
  }
  ```
- **Errors**:
  - `404`: User not found.

---

## Feedback APIs

### 7. **Add Feedback**
- **Endpoint**: `POST /feedback`
- **Description**: Adds feedback for a product.
- **Request Body**:
  ```json
  {
    "userId": 1,
    "productId": 1,
    "rating": 5,
    "review": "Great product!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Feedback added successfully"
  }
  ```
- **Errors**:
  - `400`: Invalid request body.

---

### 8. **Get Feedback For Product**
- **Endpoint**: `GET /feedback/:productId`
- **Description**: Retrieves feedback for a specific product.
- **Response**:
  ```json
  {
    "success": true,
    "feedback": [
      {
        "userId": 1,
        "rating": 5,
        "review": "Great product!"
      },
      ...
    ]
  }
  ```
- **Errors**:
  - `404`: Product not found.

---

## AR Session APIs

### 9. **Create AR Session**
- **Endpoint**: `POST /ar`
- **Description**: Logs an AR session for a user and product.
- **Request Body**:
  ```json
  {
    "userId": 1,
    "productId": 1,
    "snapshots": ["snapshot1.jpg", "snapshot2.jpg"],
    "sessionMetadata": { "device": "iPhone" }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "sessionId": 456
  }
  ```
- **Errors**:
  - `400`: Invalid request body.

---

### 10. **Get AR Sessions For User**
- **Endpoint**: `GET /ar/:userId`
- **Description**: Retrieves AR sessions for a specific user.
- **Response**:
  ```json
  {
    "success": true,
    "sessions": [
      {
        "id": 1,
        "productId": 1,
        "snapshots": ["snapshot1.jpg", "snapshot2.jpg"]
      },
      ...
    ]
  }
  ```
- **Errors**:
  - `404`: User not found.

---

## Upload APIs

### 11. **Upload File**
- **Endpoint**: `POST /upload`
- **Description**: Uploads a file to MinIO.
- **Request Body**: `multipart/form-data`
  - Field: `file`
- **Response**:
  ```json
  {
    "success": true,
    "url": "http://your-minio-url/optivista/file.jpg"
  }
  ```
- **Errors**:
  - `500`: File upload failed.

---

## Error Responses

### Common Errors
| Status Code | Message                     |
|-------------|-----------------------------|
| 400         | Bad Request                 |
| 401         | Unauthorized                |
| 403         | Forbidden                   |
| 404         | Resource Not Found          |
| 500         | Internal Server Error       |

---

## Testing

- Use **Postman** or **cURL** to test API endpoints.
- Example `cURL` command:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
       -d '{"email":"test@example.com","password":"password"}' \
       http://localhost:3000/api/auth/login
  ```