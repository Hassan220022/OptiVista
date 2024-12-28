import 'package:flutter/material.dart';

class AppStateNotifier extends ChangeNotifier {
  bool _loggedIn = false;

  bool get loggedIn => _loggedIn;

  void setLoggedIn(bool value) {
    _loggedIn = value;

    notifyListeners();
  }
}
