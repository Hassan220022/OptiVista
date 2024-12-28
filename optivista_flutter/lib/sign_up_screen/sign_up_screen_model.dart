import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class SignUpScreenModel extends ChangeNotifier {
  // Controllers for input fields
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  // FocusNodes for input fields (optional)
  final FocusNode nameFocusNode = FocusNode();
  final FocusNode emailFocusNode = FocusNode();
  final FocusNode passwordFocusNode = FocusNode();
  final FocusNode confirmPasswordFocusNode = FocusNode();

  // Password visibility toggles
  bool passwordVisibility = false;
  bool confirmPasswordVisibility = false;

  // Loading and error states
  bool isLoading = false;
  String? errorMessage;

  // Dispose controllers and focus nodes
  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();

    nameFocusNode.dispose();
    emailFocusNode.dispose();
    passwordFocusNode.dispose();
    confirmPasswordFocusNode.dispose();

    super.dispose();
  }

  // Toggle password visibility
  void togglePasswordVisibility() {
    passwordVisibility = !passwordVisibility;
    notifyListeners();
  }

  void toggleConfirmPasswordVisibility() {
    confirmPasswordVisibility = !confirmPasswordVisibility;
    notifyListeners();
  }

  // Validate input fields
  bool validateInputs() {
    if (nameController.text.trim().isEmpty) {
      errorMessage = 'Please enter your full name.';
      notifyListeners();
      return false;
    }

    if (emailController.text.trim().isEmpty) {
      errorMessage = 'Please enter your email address.';
      notifyListeners();
      return false;
    }

    // Simple email regex
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    if (!emailRegex.hasMatch(emailController.text.trim())) {
      errorMessage = 'Please enter a valid email address.';
      notifyListeners();
      return false;
    }

    if (passwordController.text.isEmpty) {
      errorMessage = 'Please enter a password.';
      notifyListeners();
      return false;
    }

    if (passwordController.text.length < 6) {
      errorMessage = 'Password must be at least 6 characters long.';
      notifyListeners();
      return false;
    }

    if (passwordController.text != confirmPasswordController.text) {
      errorMessage = 'Passwords do not match.';
      notifyListeners();
      return false;
    }

    errorMessage = null;
    notifyListeners();
    return true;
  }

  // Handle sign-up action
  Future<bool> signUp(BuildContext context) async {
    if (!validateInputs()) {
      return false;
    }

    isLoading = true;
    notifyListeners();

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      bool success = await authProvider.register(
        username: nameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text,
      );

      isLoading = false;
      notifyListeners();

      if (success) {
        // Registration successful
        return true;
      } else {
        // Registration failed with unknown error
        errorMessage = 'Registration failed. Please try again.';
        notifyListeners();
        return false;
      }
    } catch (e) {
      isLoading = false;
      errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Optionally, handle Google Sign-In
  // Future<bool> signUpWithGoogle(BuildContext context) async {
  //   isLoading = true;
  //   notifyListeners();

  //   try {
  //     final authProvider = Provider.of<AuthProvider>(context, listen: false);
  //     bool success = await authProvider.signInWithGoogle();

  //     isLoading = false;
  //     notifyListeners();

  //     if (success) {
  //       // Sign-In successful
  //       return true;
  //     } else {
  //       // Sign-In failed with unknown error
  //       errorMessage = 'Google Sign-In failed. Please try again.';
  //       notifyListeners();
  //       return false;
  //     }
  //   } catch (e) {
  //     isLoading = false;
  //     errorMessage = e.toString();
  //     notifyListeners();
  //     return false;
  //   }
  // }
}
