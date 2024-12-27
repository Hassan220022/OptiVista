Here’s a detailed **README.md** for your backend project:

---

# Optivista Backend

## Introduction
The Optivista backend is a robust and scalable server-side application for managing an e-commerce platform with AR-enhanced features. It provides RESTful APIs for user management, product catalog, AR sessions, consultations, feedback, orders, and file uploads. The backend is built using **Node.js** and integrates with **MySQL** for data storage and **MinIO** for object storage.

---

## Features
- **Authentication and Authorization**:
  - Secure login and registration with JWT-based authentication.
  - Role-based access control (e.g., admin, customer, consultant).
- **Product Catalog**:
  - Manage product listings with AR support and dynamic stock updates.
- **AR Sessions**:
  - Track AR interactions for analytics and personalized recommendations.
- **Consultations**:
  - Schedule and manage consultations between customers and consultants.
- **Orders and Payments**:
  - Handle user orders, order items, and payment tracking.
- **Feedback System**:
  - Collect and display product reviews and ratings.
- **File Uploads**:
  - Store product images, AR models, and user-generated content in MinIO.

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+)
- **MySQL** (v8+)
- **MinIO** (or an S3-compatible storage)
- **npm** (Node Package Manager)

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Hassan220022/OptiVista.git
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root.
   - Add the following:
     ```env
     # Database Configuration
     DB_HOST=server_IP
     DB_PORT=Database_Port
     DB_USER=Database_username
     DB_PASSWORD=Database_Password
     DB_NAME=Database_name

     # MinIO Configuration
     MINIO_ENDPOINT=server_IP
     MINIO_PORT=Minio_server_port
     MINIO_ACCESS_KEY=MINIO_ACCESS_KEY
     MINIO_SECRET_KEY=MINIO_secret_key
     MINIO_BUCKET=bucket_name

     # JWT Configuration
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=1h

     # Email Configuration
     EMAIL_HOST=smtp.example.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@example.com
     EMAIL_PASS=your-email-password
     ```

4. **Set Up the Database**:
   - Import the provided SQL schema and test data into MySQL.
   - Run the following command in your MySQL client:
     ```sql
     SOURCE /path/to/ecom_db_schema.sql;
     ```

5. **Start the Server**:
   - In development mode:
     ```bash
     npm run dev
     ```
   - In production mode:
     ```bash
     npm start
     ```

---

## Project Structure

```
.
├── config/                     # Configuration files
│   ├── appConfig.js            # Application-level configurations
│   ├── database.js             # MySQL connection setup
│   └── minio.js                # MinIO client setup
├── controllers/                # Handles HTTP request logic
├── middlewares/                # Authentication and error handling middleware
├── models/                     # Database queries and models
├── routes/                     # API route definitions
├── services/                   # Business logic for various features
├── utils/                      # Utility functions (email, JWT, etc.)
├── index.js                    # Server entry point
├── .env                        # Environment variables
├── package.json                # Project metadata and dependencies
└── README.md                   # Project documentation
```

---

## Usage

### API Endpoints
- **Authentication**:
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.

- **Product Catalog**:
  - `GET /api/products`: Fetch all products.
  - `GET /api/products/:id`: Fetch a product by ID.

- **Orders**:
  - `POST /api/orders`: Create a new order.
  - `GET /api/orders/:userId`: Fetch orders for a specific user.

- **Feedback**:
  - `POST /api/feedback`: Submit feedback for a product.
  - `GET /api/feedback/:productId`: Get feedback for a product.

- **AR Sessions**:
  - `POST /api/ar`: Create an AR session.
  - `GET /api/ar/:userId`: Get AR sessions for a user.

- **Consultations**:
  - `POST /api/consultations`: Schedule a consultation.
  - `GET /api/consultations/:userId`: Fetch consultations for a user.

- **File Uploads**:
  - `POST /api/upload`: Upload a file.

### Error Handling
- **404 Not Found**: Returned when an invalid route is accessed.
- **500 Internal Server Error**: Returned when an unhandled server error occurs.

---

## Environment Variables

| Variable          | Description                                   |
|--------------------|-----------------------------------------------|
| `DB_HOST`         | MySQL database host                          |
| `DB_PORT`         | MySQL database port                          |
| `DB_USER`         | MySQL database username                      |
| `DB_PASSWORD`     | MySQL database password                      |
| `DB_NAME`         | MySQL database name                          |
| `MINIO_ENDPOINT`  | MinIO server endpoint                        |
| `MINIO_PORT`      | MinIO server port                            |
| `MINIO_ACCESS_KEY`| MinIO access key                             |
| `MINIO_SECRET_KEY`| MinIO secret key                             |
| `MINIO_BUCKET`    | Default MinIO bucket                         |
| `JWT_SECRET`      | JWT secret key                               |
| `JWT_EXPIRES_IN`  | JWT token expiration time                    |
| `EMAIL_HOST`      | SMTP server for email notifications          |
| `EMAIL_PORT`      | SMTP server port                             |
| `EMAIL_USER`      | SMTP username                                |
| `EMAIL_PASS`      | SMTP password                                |

---

## Testing
- Use **Postman** or **cURL** to test API endpoints.
- Example `cURL` command to test login:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
       -d '{"email":"test@demo.com","password":"password"}' \
       http://localhost:3000/api/auth/login
  ```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contribution
Feel free to fork the repository and submit a pull request. Contributions are welcome!

---

This README provides a comprehensive overview of your backend project. You can update the **Installation**, **Environment Variables**, or other sections as needed. Let me know if you'd like help with anything else!