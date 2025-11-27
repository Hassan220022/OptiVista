import 'dart:async';
import 'package:flutter/services.dart';
import '../models/ar_session_state.dart';
import '../models/ar_fit_params.dart';
import 'arkit_channel.dart';

/// Platform channel for ARCore (Android) communication
class ARCoreChannel {
  static const MethodChannel _channel = MethodChannel('com.optivista/arcore');
  
  /// Stream controller for AR session state updates
  final _sessionStateController = StreamController<ARSessionState>.broadcast();
  
  /// Stream of AR session state changes
  Stream<ARSessionState> get sessionStateStream => _sessionStateController.stream;

  ARCoreChannel() {
    _channel.setMethodCallHandler(_handleMethodCall);
  }

  /// Handle incoming method calls from native
  Future<dynamic> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'onSessionStateChanged':
        final state = ARSessionState.fromJson(call.arguments as Map<String, dynamic>);
        _sessionStateController.add(state);
        break;
      case 'onFaceTrackingUpdate':
        // Handle face tracking data for Android
        break;
      case 'onError':
        final error = call.arguments as String;
        _sessionStateController.addError(Exception(error));
        break;
    }
  }

  /// Initialize AR session
  Future<bool> initializeSession() async {
    try {
      final result = await _channel.invokeMethod<bool>('initializeSession');
      return result ?? false;
    } on PlatformException catch (e) {
      throw ARException('Failed to initialize ARCore session: ${e.message}');
    }
  }

  /// Check if device supports ARCore
  Future<bool> checkDeviceSupport() async {
    try {
      final result = await _channel.invokeMethod<bool>('checkDeviceSupport');
      return result ?? false;
    } on PlatformException {
      return false;
    }
  }

  /// Check if ARCore is installed
  Future<bool> checkARCoreInstalled() async {
    try {
      final result = await _channel.invokeMethod<bool>('checkARCoreInstalled');
      return result ?? false;
    } on PlatformException {
      return false;
    }
  }

  /// Request ARCore installation
  Future<void> requestARCoreInstall() async {
    try {
      await _channel.invokeMethod('requestARCoreInstall');
    } on PlatformException catch (e) {
      throw ARException('Failed to request ARCore install: ${e.message}');
    }
  }

  /// Load 3D glasses model
  Future<void> loadGlassesModel(String modelUrl, String productId) async {
    try {
      await _channel.invokeMethod('loadGlassesModel', {
        'modelUrl': modelUrl,
        'productId': productId,
      });
    } on PlatformException catch (e) {
      throw ARException('Failed to load glasses model: ${e.message}');
    }
  }

  /// Update fit parameters (scale, position)
  Future<void> updateFitParams(ARFitParams params) async {
    try {
      await _channel.invokeMethod('updateFitParams', params.toJson());
    } on PlatformException catch (e) {
      throw ARException('Failed to update fit params: ${e.message}');
    }
  }

  /// Capture screenshot of AR view
  Future<String?> captureScreenshot() async {
    try {
      final path = await _channel.invokeMethod<String>('captureScreenshot');
      return path;
    } on PlatformException catch (e) {
      throw ARException('Failed to capture screenshot: ${e.message}');
    }
  }

  /// Pause AR session
  Future<void> pauseSession() async {
    try {
      await _channel.invokeMethod('pauseSession');
    } on PlatformException catch (e) {
      throw ARException('Failed to pause session: ${e.message}');
    }
  }

  /// Resume AR session
  Future<void> resumeSession() async {
    try {
      await _channel.invokeMethod('resumeSession');
    } on PlatformException catch (e) {
      throw ARException('Failed to resume session: ${e.message}');
    }
  }

  /// End AR session and cleanup
  Future<void> endSession() async {
    try {
      await _channel.invokeMethod('endSession');
    } on PlatformException catch (e) {
      throw ARException('Failed to end session: ${e.message}');
    }
  }

  /// Dispose resources
  void dispose() {
    _sessionStateController.close();
  }
}
