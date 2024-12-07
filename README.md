# OptiVista: Cross-Platform AR-Enhanced E-Commerce Application for Virtual Eyewear Fitting

<!-- ![OptiVista Banner](https://github.com/Hassan220022/OptiVista/blob/main/assets/banner.png) -->

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

**OptiVista** is a cutting-edge, cross-platform mobile e-commerce application designed to revolutionize the online eyewear shopping experience. By leveraging Augmented Reality (AR) technologies, OptiVista allows users to virtually try on eyewear products in real-time, enhancing consumer confidence and reducing return rates. Built with Flutter for seamless cross-platform compatibility, a robust MySQL backend, and advanced AR frameworks (ARKit, ARCore, Unity AR), OptiVista offers an immersive and user-friendly shopping experience.

## Features

- **Cross-Platform Support:** Available on both iOS and Android devices, ensuring a wide reach.
- **Augmented Reality Try-On:** Real-time virtual try-on of eyewear using AR technologies.
- **Comprehensive Product Catalog:** Browse a diverse range of eyewear styles, colors, and sizes.
- **Personalized Recommendations:** Tailored product suggestions based on user preferences and behavior.
- **Secure Checkout:** Streamlined and secure payment processing with multiple payment gateways.
- **User Profiles:** Manage user information, preferences, and order history.
- **Feedback Mechanism:** Provide ratings and reviews for products and AR experiences.
- **Responsive Design:** Optimized for various screen sizes and orientations.
- **Accessibility Features:** Includes scalable text, high-contrast modes, and voice-over support.

## Technologies Used

- **Frontend:**
  - [Flutter](https://flutter.dev/) - For cross-platform mobile UI development.
- **Backend:**
  - [MySQL](https://www.mysql.com/) - Relational database management.
  - [Node.js](https://nodejs.org/) / [PHP](https://www.php.net/) - Server-side scripting.
- **Augmented Reality:**
  - [ARKit](https://developer.apple.com/arkit/) - Apple's AR framework for iOS.
  - [ARCore](https://developers.google.com/ar) - Google's AR framework for Android.
  - [Unity AR Foundation](https://unity.com/products/unity-arfoundation) - For advanced 3D rendering and cross-platform AR support.
- **Security:**
  - [OAuth 2.0](https://oauth.net/2/) - Authentication protocol.
  - [JWT (JSON Web Tokens)](https://jwt.io/) - Secure token-based authentication.
  - [TLS](https://www.cloudflare.com/learning/ssl/what-is-tls/) - Data encryption.
- **Development Tools:**
  - [Git](https://git-scm.com/) - Version control.
  - [GitHub Actions](https://github.com/features/actions) - CI/CD pipelines.
  - [Jira](https://www.atlassian.com/software/jira) / [Trello](https://trello.com/) - Project management.

## System Architecture

OptiVista is built using a layered architecture to ensure scalability, modularity, and seamless integration of diverse technologies.

### Layers

1. **Presentation Layer (Frontend):** Developed with Flutter, responsible for the UI/UX.
2. **Business Logic Layer:** Handles data processing and application logic, implemented in Flutter and the backend server.
3. **Data Access Layer (Backend):** Managed by a MySQL database, handling data storage and retrieval.
4. **Integration Layer (AR Modules):** Integrates ARKit, ARCore, and Unity AR for augmented reality functionalities.

### Architecture Diagram

![System Architecture](https://github.com/Hassan220022/OptiVista/blob/main/assets/system_architecture.png)

## Installation

### Prerequisites

- **Flutter SDK:** [Installation Guide](https://flutter.dev/docs/get-started/install)
- **Unity:** [Download Unity](https://unity.com/)
- **MySQL Server:** [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Node.js or PHP:** Depending on backend choice.
- **Xcode (for iOS development):** Available on Mac App Store.
- **Android Studio (for Android development):** [Download Android Studio](https://developer.android.com/studio)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Hassan220022/OptiVista.git
   cd OptiVista
   ```

2. **Setup Backend:**

   - **Using Node.js:**

     ```bash
     cd backend/nodejs
     npm install
     cp .env.example .env
     # Update .env with your configuration
     npm start
     ```

   - **Using PHP:**

     ```bash
     cd backend/php
     composer install
     cp .env.example .env
     # Update .env with your configuration
     php -S localhost:8000
     ```

3. **Setup MySQL Database:**

   - Create a new database:

     ```sql
     CREATE DATABASE eyewear_ecommerce;
     ```

   - Import the schema:

     ```bash
     mysql -u yourusername -p eyewear_ecommerce < backend/schema.sql
     ```

4. **Configure AR Modules:**

   - **Unity AR:**
     - Open the Unity project located in `ARModules/UnityAR`.
     - Build the Unity library for both iOS and Android following [Unity's documentation](https://docs.unity3d.com/Manual/UnityasaLibrary.html).

   - **ARKit and ARCore:**
     - Ensure platform-specific configurations are set up in the Flutter project using platform channels.

5. **Run the Flutter Application:**

   ```bash
   cd frontend/flutter_app
   flutter pub get
   flutter run
   ```

## Usage

1. **Launch the App:**
   - Open the application on your iOS or Android device.

2. **Browse Products:**
   - Navigate through the product catalog to explore various eyewear options.

3. **Virtual Try-On:**
   - Select an eyewear product and tap on the "Try On" button to activate the AR feature.
   - Adjust the position and scale of the virtual eyewear as needed.

4. **Checkout:**
   - Add desired products to the cart and proceed to a secure checkout.
   - Complete your purchase using supported payment gateways.

5. **Manage Profile:**
   - Access your profile to view order history, update preferences, and manage account settings.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Please ensure that your contributions adhere to the project's coding standards and include appropriate tests.

## Authors

- **Hassan Mikawi**
- **Yehia Hatem**
- **Mostafa Othman**

## License

This project is licensed under the [MIT License](https://github.com/Hassan220022/OptiVista/blob/main/LICENSE).

## Acknowledgements

- [Flutter](https://flutter.dev/)
- [ARKit](https://developer.apple.com/arkit/)
- [ARCore](https://developers.google.com/ar)
- [Unity AR Foundation](https://unity.com/products/unity-arfoundation)
- [MySQL](https://www.mysql.com/)
- [Node.js](https://nodejs.org/) / [PHP](https://www.php.net/)
- [OAuth 2.0](https://oauth.net/2/)
- [JWT](https://jwt.io/)

---

For any questions or support, please contact [hassansherif122202@gmail.com](mailto:hassansherif122202@gmail.com).