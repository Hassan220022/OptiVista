// lib/flutter_flow/nav/router.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'app_state.dart';
import '../../sign_up_screen/sign_up_screen_widget.dart';
import '../../home_screen/home_screen_widget.dart';
import '../../sign_in_screen/sign_in_screen_widget.dart';
import '../../legal_information_screen/legal_information_screen_widget.dart';
// Import other screens as needed

GoRouter createRouter(AppStateNotifier appStateNotifier) {
  return GoRouter(
    initialLocation: '/signUpScreen',
    routes: [
      GoRoute(
        path: '/signUpScreen',
        builder: (context, state) => SignUpScreenWidget(),
      ),
      GoRoute(
        path: '/signInScreen',
        builder: (context, state) => SignInScreenWidget(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => HomeScreenWidget(),
      ),
      GoRoute(
        path: '/legalInformationScreen',
        builder: (context, state) => LegalInformationScreenWidget(),
      ),
      // Add other routes here
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Page not found')),
    ),
  );
}
