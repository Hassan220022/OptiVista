import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:page_transition/page_transition.dart';
import 'package:provider/provider.dart';
import '/index.dart';
import '/main.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/lat_lng.dart';
import '/flutter_flow/place.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'serialization_util.dart';

export 'package:go_router/go_router.dart';
export 'serialization_util.dart';

const kTransitionInfoKey = '__transition_info__';

GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();

class AppStateNotifier extends ChangeNotifier {
  AppStateNotifier._();

  static AppStateNotifier? _instance;
  static AppStateNotifier get instance => _instance ??= AppStateNotifier._();

  bool showSplashImage = true;

  void stopShowingSplashImage() {
    showSplashImage = false;
    notifyListeners();
  }
}

class CustomNavBar extends StatefulWidget {
  final Widget child;

  const CustomNavBar({Key? key, required this.child}) : super(key: key);

  @override
  _CustomNavBarState createState() => _CustomNavBarState();
}

class _CustomNavBarState extends State<CustomNavBar> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/chatScreen'),
        backgroundColor: Colors.purple,
        child: const Icon(Icons.search),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });

            switch (index) {
              case 0:
                context.go('/homeScreen');
                break;
              case 1:
                context.go('/productCatalogScreen');
                break;
              case 2:
                context.go('/cartScreen');
                break;
              case 3:
                context.go('/welcomeScreen');
                break;
            }
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.grey,
          backgroundColor: Colors.white,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.list),
              label: 'Catalog',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.shopping_cart),
              label: 'Cart',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Account',
            ),
          ],
        ),
      ),
    );
  }
}

GoRouter createRouter(AppStateNotifier appStateNotifier) => GoRouter(
  initialLocation: '/homeScreen',
  debugLogDiagnostics: true,
  refreshListenable: appStateNotifier,
  navigatorKey: appNavigatorKey,
  errorBuilder: (context, state) => WelcomeScreenWidget(),
  routes: [
    GoRoute(
      name: 'home_screen',
      path: '/homeScreen',
      builder: (context, state) => CustomNavBar(
        child: HomeScreenWidget(),
      ),
    ),
    GoRoute(
      name: 'product_catalog_screen',
      path: '/productCatalogScreen',
      builder: (context, state) => CustomNavBar(
        child: ProductCatalogScreenWidget(),
      ),
    ),
    GoRoute(
      name: 'cart_screen',
      path: '/cartScreen',
      builder: (context, state) => CustomNavBar(
        child: CartScreenWidget(),
      ),
    ),
    GoRoute(
      name: 'profile_screen',
      path: '/profileScreen',
      builder: (context, state) => CustomNavBar(
        child: ProfileScreenWidget(),
      ),
    ),
    GoRoute(
      name: 'welcome_screen',
      path: '/welcomeScreen',
      builder: (context, state) => WelcomeScreenWidget(),
    ),
    GoRoute(
      name: 'sign_in_screen',
      path: '/signInScreen',
      builder: (context, state) => SignInScreenWidget(),
    ),
    GoRoute(
      name: 'sign_up_screen',
      path: '/signUpScreen',
      builder: (context, state) => SignUpScreenWidget(),
    ),
    GoRoute(
      name: 'product_details_screen',
      path: '/productDetailsScreen',
      builder: (context, state) => ProductDetailsScreenWidget(),
    ),
    GoRoute(
      name: 'ar_feature_screen',
      path: '/arFeatureScreen',
      builder: (context, state) => ArFeatureScreenWidget(),
    ),
    GoRoute(
      name: 'checkout_screen',
      path: '/checkoutScreen',
      builder: (context, state) => CheckoutScreenWidget(),
    ),
    GoRoute(
      name: 'order_history_screen',
      path: '/orderHistoryScreen',
      builder: (context, state) => OrderHistoryScreenWidget(),
    ),
    GoRoute(
      name: 'forget_password_screen',
      path: '/forgetPasswordScreen',
      builder: (context, state) => ForgetPasswordScreenWidget(),
    ),
    GoRoute(
      name: 'feedback_support_screen',
      path: '/feedbackSupportScreen',
      builder: (context, state) => FeedbackSupportScreenWidget(),
    ),
    GoRoute(
      name: 'settings_screen',
      path: '/settingsScreen',
      builder: (context, state) => SettingsScreenWidget(),
    ),
    GoRoute(
      name: 'legal_information_screen',
      path: '/legalInformationScreen',
      builder: (context, state) => LegalInformationScreenWidget(),
    ),
  ],
);

extension NavParamExtensions on Map<String, String?> {
  Map<String, String> get withoutNulls => Map.fromEntries(
        entries
            .where((e) => e.value != null)
            .map((e) => MapEntry(e.key, e.value!)),
      );
}

extension NavigationExtensions on BuildContext {
  void safePop() {
    if (canPop()) {
      pop();
    } else {
      go('/');
    }
  }
}

extension _GoRouterStateExtensions on GoRouterState {
  Map<String, dynamic> get extraMap =>
      extra != null ? extra as Map<String, dynamic> : {};
  Map<String, dynamic> get allParams => <String, dynamic>{}
    ..addAll(pathParameters)
    ..addAll(uri.queryParameters)
    ..addAll(extraMap);
  TransitionInfo get transitionInfo => extraMap.containsKey(kTransitionInfoKey)
      ? extraMap[kTransitionInfoKey] as TransitionInfo
      : TransitionInfo.appDefault();
}

class FFParameters {
  FFParameters(this.state, [this.asyncParams = const {}]);

  final GoRouterState state;
  final Map<String, Future<dynamic> Function(String)> asyncParams;

  Map<String, dynamic> futureParamValues = {};

  bool get isEmpty =>
      state.allParams.isEmpty ||
      (state.allParams.length == 1 &&
          state.extraMap.containsKey(kTransitionInfoKey));
  bool isAsyncParam(MapEntry<String, dynamic> param) =>
      asyncParams.containsKey(param.key) && param.value is String;
  bool get hasFutures => state.allParams.entries.any(isAsyncParam);
  Future<bool> completeFutures() => Future.wait(
        state.allParams.entries.where(isAsyncParam).map(
          (param) async {
            final doc = await asyncParams[param.key]!(param.value)
                .onError((_, __) => null);
            if (doc != null) {
              futureParamValues[param.key] = doc;
              return true;
            }
            return false;
          },
        ),
      ).onError((_, __) => [false]).then((v) => v.every((e) => e));

  dynamic getParam<T>(
    String paramName,
    ParamType type, {
    bool isList = false,
  }) {
    if (futureParamValues.containsKey(paramName)) {
      return futureParamValues[paramName];
    }
    if (!state.allParams.containsKey(paramName)) {
      return null;
    }
    final param = state.allParams[paramName];
    if (param is! String) {
      return param;
    }
    return deserializeParam<T>(
      param,
      type,
      isList,
    );
  }
}

class TransitionInfo {
  const TransitionInfo({
    required this.hasTransition,
    this.transitionType = PageTransitionType.fade,
    this.duration = const Duration(milliseconds: 300),
    this.alignment,
  });

  final bool hasTransition;
  final PageTransitionType transitionType;
  final Duration duration;
  final Alignment? alignment;

  static TransitionInfo appDefault() => TransitionInfo(hasTransition: false);
}
