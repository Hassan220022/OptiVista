// lib/sign_up_screen/sign_up_screen_widget.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'sign_up_screen_model.dart';
import '../home_screen/home_screen_widget.dart'; // Adjust the path as needed

class SignUpScreenWidget extends StatelessWidget {
  const SignUpScreenWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Provide SignUpScreenModel to the widget tree
    return ChangeNotifierProvider(
      create: (_) => SignUpScreenModel(),
      child: Scaffold(
        appBar: AppBar(
          title: Text('Create Account'),
          backgroundColor: Colors.blue, // Customize as needed
        ),
        body: SafeArea(
          child: Consumer<SignUpScreenModel>(
            builder: (context, model, child) {
              return SingleChildScrollView(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Display error message if any
                    if (model.errorMessage != null)
                      Container(
                        padding: EdgeInsets.all(8.0),
                        color: Colors.redAccent,
                        child: Row(
                          children: [
                            Icon(Icons.error, color: Colors.white),
                            SizedBox(width: 8.0),
                            Expanded(
                              child: Text(
                                model.errorMessage!,
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                            IconButton(
                              icon: Icon(Icons.close, color: Colors.white),
                              onPressed: () {
                                model.errorMessage = null;
                              },
                            ),
                          ],
                        ),
                      ),
                    SizedBox(height: 16.0),
                    // Full Name Field
                    TextField(
                      controller: model.nameController,
                      focusNode: model.nameFocusNode,
                      decoration: InputDecoration(
                        labelText: 'Username',
                        prefixIcon: Icon(Icons.person),
                        border: OutlineInputBorder(),
                      ),
                      textInputAction: TextInputAction.next,
                      onSubmitted: (_) {
                        FocusScope.of(context)
                            .requestFocus(model.emailFocusNode);
                      },
                    ),
                    SizedBox(height: 16.0),
                    // Email Address Field
                    TextField(
                      controller: model.emailController,
                      focusNode: model.emailFocusNode,
                      decoration: InputDecoration(
                        labelText: 'Email Address',
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      onSubmitted: (_) {
                        FocusScope.of(context)
                            .requestFocus(model.passwordFocusNode);
                      },
                    ),
                    SizedBox(height: 16.0),
                    // Password Field
                    TextField(
                      controller: model.passwordController,
                      focusNode: model.passwordFocusNode,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: Icon(Icons.lock),
                        border: OutlineInputBorder(),
                        suffixIcon: IconButton(
                          icon: Icon(
                            model.passwordVisibility
                                ? Icons.visibility
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            model.togglePasswordVisibility();
                          },
                        ),
                      ),
                      obscureText: !model.passwordVisibility,
                      textInputAction: TextInputAction.next,
                      onSubmitted: (_) {
                        FocusScope.of(context)
                            .requestFocus(model.confirmPasswordFocusNode);
                      },
                    ),
                    SizedBox(height: 16.0),
                    // Confirm Password Field
                    TextField(
                      controller: model.confirmPasswordController,
                      focusNode: model.confirmPasswordFocusNode,
                      decoration: InputDecoration(
                        labelText: 'Confirm Password',
                        prefixIcon: Icon(Icons.lock),
                        border: OutlineInputBorder(),
                        suffixIcon: IconButton(
                          icon: Icon(
                            model.confirmPasswordVisibility
                                ? Icons.visibility
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            model.toggleConfirmPasswordVisibility();
                          },
                        ),
                      ),
                      obscureText: !model.confirmPasswordVisibility,
                      textInputAction: TextInputAction.done,
                      onSubmitted: (_) {
                        // Optionally, trigger sign-up
                        _handleSignUp(context, model);
                      },
                    ),
                    SizedBox(height: 24.0),
                    // Sign Up Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: model.isLoading
                            ? null
                            : () {
                                _handleSignUp(context, model);
                              },
                        child: model.isLoading
                            ? SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2.0,
                                ),
                              )
                            : Text('Create Account'),
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          textStyle: TextStyle(fontSize: 16.0),
                        ),
                      ),
                    ),
                    SizedBox(height: 16.0),
                    // Divider
                    Row(
                      children: [
                        Expanded(child: Divider()),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 8.0),
                          child: Text('OR'),
                        ),
                        Expanded(child: Divider()),
                      ],
                    ),
                    SizedBox(height: 16.0),
                    // Sign Up with Google Button (Optional)
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        icon: Icon(Icons.login),
                        label: Text('Sign Up with Google'),
                        onPressed: () async {
                          // bool success = await model.signUpWithGoogle(context);
                          // if (success) {
                          //   Navigator.pushReplacement(
                          //     context,
                          //     MaterialPageRoute(
                          //         builder: (_) => HomeScreenWidget()),
                          //   );
                          // }
                        },
                        style: OutlinedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          textStyle: TextStyle(fontSize: 16.0),
                          side: BorderSide(color: Colors.red),
                        ),
                      ),
                    ),
                    SizedBox(height: 24.0),
                    // Navigate to Sign In Screen
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Already have an account? '),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushReplacementNamed(
                                context, '/signInScreen');
                          },
                          child: Text(
                            'Sign In',
                            style: TextStyle(
                              color: Colors.blue,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  // Handle sign-up action
  void _handleSignUp(BuildContext context, SignUpScreenModel model) async {
    bool success = await model.signUp(context);
    if (success) {
      // Navigate to Home Screen or another appropriate screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomeScreenWidget()),
      );
    }
    // Error messages are handled by the model and displayed in the UI
  }
}
