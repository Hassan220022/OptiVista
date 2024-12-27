# Setup Guide

## Introduction
This guide will help you set up the **Optivista Backend** on your local or production environment. Follow the steps carefully to ensure the application runs smoothly.

---

## Prerequisites
Ensure the following software is installed on your system:
1. **Node.js** (v14 or above) – [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js) – For package management.
3. **MySQL** (v8 or above) – [Download MySQL](https://dev.mysql.com/downloads/)
4. **MinIO** or any S3-compatible storage – [Download MinIO](https://min.io/)
5. **Git** – For version control (optional but recommended).

---

## Step 1: Clone the Repository

1. Open a terminal and run the following command:
   ```bash
   git clone https://github.com/your-username/optivista-backend.git
   cd optivista-backend
   ```

---

## Step 2: Install Dependencies

1. Install the required Node.js packages using npm:
   ```bash
   npm install
   ```

---

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the project root directory:
   ```bash
   touch .env
   ```

2. Add the following environment variables to the `.env` file:
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

3. Update the placeholders (`your-jwt-secret`, `your-email@example.com`, etc.) with your actual credentials.

---

## Step 4: Set Up the Database

1. **Start MySQL**:
   - Ensure your MySQL server is running.

2. **Create the Database**:
   - Open your MySQL client or use any database management tool (e.g., MySQL Workbench).
   - Run the provided SQL schema to create the `ecom_db` database:
     ```bash
     mysql -u dev -p ecom_db < /path/to/ecom_db_schema.sql
     ```

3. **Verify Tables**:
   - Check that all tables (e.g., `users`, `products`, `orders`, etc.) have been created successfully.

---

## Step 5: Set Up MinIO

1. **Install MinIO**:
   - Follow the [MinIO installation guide](https://docs.min.io/docs/minio-quickstart-guide.html).

2. **Start the MinIO Server**:
   ```bash
   minio server /data
   ```

3. **Set Up MinIO Client (Optional)**:
   - Install `mc` (MinIO Client) and configure it:
     ```bash
     mc alias set myminio http://server_IP:9000 dev kRgWrHnGVIG07Mn2yHmaqT2UHnoYbfxaKqfaRgtk
     ```

4. **Create the Default Bucket**:
   ```bash
   mc mb myminio/optivista
   ```

---

## Step 6: Run the Application

1. **Start the Server**:
   - In development mode:
     ```bash
     npm run dev
     ```
   - In production mode:
     ```bash
     npm start
     ```

2. **Verify the Server**:
   - Open your browser or Postman and access the base URL:
     - Development: `http://localhost:3000/api`
     - Production: `https://your-production-url.com/api`

---

## Step 7: Testing the API

1. Use **Postman** or **cURL** to test the API endpoints.
2. Example `cURL` command for login:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"password"}' \
        http://localhost:3000/api/auth/login
   ```

---

## Step 8: Deploy to Production

1. **Choose a Hosting Provider**:
   - Use services like AWS, Heroku, or DigitalOcean.

2. **Set Up Environment Variables**:
   - Configure the `.env` file on the production server.

3. **Install Dependencies**:
   - Run `npm install --production` to install only the required dependencies.

4. **Run the Server**:
   ```bash
   node index.js
   ```

5. **Secure Your Server**:
   - Use **SSL/TLS** to secure your production server.

---

## Troubleshooting

1. **Database Connection Issues**:
   - Check the credentials in `.env`.
   - Ensure the MySQL server is running and accessible from your machine.

2. **MinIO Connection Issues**:
   - Verify the MinIO endpoint and access keys in `.env`.
   - Use the MinIO client (`mc`) to debug connection problems.

3. **JWT Authentication Issues**:
   - Ensure the `JWT_SECRET` in `.env` matches the configuration.

4. **Server Not Starting**:
   - Check for syntax errors in `.env` or missing dependencies.
   - Run `npm install` to ensure all packages are installed.

---

## Support
For support, open an issue on the repository or contact the development team.
