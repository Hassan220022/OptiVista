import 'dart:async';
import 'package:flutter/services.dart';
import '../models/ar_session_state.dart';
import '../models/ar_fit_params.dart';
import 'arkit_channel.dart';

/// Platform channel for Unity AR communication (cross-platform fallback)
class UnityChannel {
  static const MethodChannel _channel = MethodChannel('com.optivista/unity_ar');
  
  /// Stream controller for AR session state updates
  final _sessionStateController = StreamController<ARSessionState>.broadcast();
  
  /// Stream of AR session state changes
  Stream<ARSessionState> get sessionStateStream => _sessionStateController.stream;

  UnityChannel() {
    _channel.setMethodCallHandler(_handleMethodCall);
  }

  /// Handle incoming method calls from Unity
  Future<dynamic> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'onSessionStateChanged':
        final state = ARSessionState.fromJson(call.arguments as Map<String, dynamic>);
        _sessionStateController.add(state);
        break;
      case 'onFaceTrackingUpdate':
        // Handle face tracking data from Unity
        break;
      case 'onModelLoaded':
        // Handle model loaded callback
        break;
      case 'onScreenshotCaptured':
        // Handle screenshot captured callback
        break;
      case 'onError':
        final error = call.arguments as String;
        _sessionStateController.addError(Exception(error));
        break;
    }
  }

  /// Initialize Unity AR session
  Future<bool> initializeSession() async {
    try {
      final result = await _channel.invokeMethod<bool>('initializeSession');
      return result ?? false;
    } on PlatformException catch (e) {
      throw ARException('Failed to initialize Unity AR session: ${e.message}');
    }
  }

  /// Check if device supports Unity AR
  Future<bool> checkDeviceSupport() async {
    try {
      final result = await _channel.invokeMethod<bool>('checkDeviceSupport');
      return result ?? false;
    } on PlatformException {
      return false;
    }
  }

  /// Load 3D glasses model from URL or asset
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

  /// Update fit parameters
  Future<void> updateFitParams(ARFitParams params) async {
    try {
      await _channel.invokeMethod('updateFitParams', params.toJson());
    } on PlatformException catch (e) {
      throw ARException('Failed to update fit params: ${e.message}');
    }
  }

  /// Set glasses color/tint
  Future<void> setGlassesColor(String hexColor) async {
    try {
      await _channel.invokeMethod('setGlassesColor', {'color': hexColor});
    } on PlatformException catch (e) {
      throw ARException('Failed to set glasses color: ${e.message}');
    }
  }

  /// Toggle lens tint
  Future<void> toggleLensTint(bool enabled, {double opacity = 0.5}) async {
    try {
      await _channel.invokeMethod('toggleLensTint', {
        'enabled': enabled,
        'opacity': opacity,
      });
    } on PlatformException catch (e) {
      throw ARException('Failed to toggle lens tint: ${e.message}');
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

  /// Start recording AR session
  Future<void> startRecording() async {
    try {
      await _channel.invokeMethod('startRecording');
    } on PlatformException catch (e) {
      throw ARException('Failed to start recording: ${e.message}');
    }
  }

  /// Stop recording and get video path
  Future<String?> stopRecording() async {
    try {
      final path = await _channel.invokeMethod<String>('stopRecording');
      return path;
    } on PlatformException catch (e) {
      throw ARException('Failed to stop recording: ${e.message}');
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
