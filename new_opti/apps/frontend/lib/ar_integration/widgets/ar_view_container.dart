import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ar_session_state.dart';
import '../models/ar_fit_params.dart';
import '../channels/arkit_channel.dart';
import '../channels/arcore_channel.dart';

/// AR View Container that manages platform-specific AR rendering
class ARViewContainer extends ConsumerStatefulWidget {
  final String productId;
  final String modelUrl;
  final ARFitParams initialFitParams;
  final ValueChanged<ARSessionState>? onSessionStateChanged;
  final ValueChanged<String>? onScreenshotCaptured;
  final VoidCallback? onError;

  const ARViewContainer({
    super.key,
    required this.productId,
    required this.modelUrl,
    this.initialFitParams = const ARFitParams(),
    this.onSessionStateChanged,
    this.onScreenshotCaptured,
    this.onError,
  });

  @override
  ConsumerState<ARViewContainer> createState() => _ARViewContainerState();
}

class _ARViewContainerState extends ConsumerState<ARViewContainer>
    with WidgetsBindingObserver {
  ARKitChannel? _arkitChannel;
  ARCoreChannel? _arcoreChannel;
  ARSessionState _sessionState = const ARSessionState();
  bool _isInitializing = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeAR();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _disposeAR();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.paused:
        _pauseSession();
        break;
      case AppLifecycleState.resumed:
        _resumeSession();
        break;
      default:
        break;
    }
  }

  Future<void> _initializeAR() async {
    try {
      if (Platform.isIOS) {
        _arkitChannel = ARKitChannel();
        _arkitChannel!.sessionStateStream.listen((state) {
          setState(() => _sessionState = state);
          widget.onSessionStateChanged?.call(state);
        });
        
        final supported = await _arkitChannel!.checkDeviceSupport();
        if (!supported) {
          throw ARException('ARKit is not supported on this device');
        }
        
        await _arkitChannel!.initializeSession();
        await _arkitChannel!.loadGlassesModel(widget.modelUrl, widget.productId);
        await _arkitChannel!.updateFitParams(widget.initialFitParams);
      } else if (Platform.isAndroid) {
        _arcoreChannel = ARCoreChannel();
        _arcoreChannel!.sessionStateStream.listen((state) {
          setState(() => _sessionState = state);
          widget.onSessionStateChanged?.call(state);
        });
        
        final supported = await _arcoreChannel!.checkDeviceSupport();
        if (!supported) {
          final installed = await _arcoreChannel!.checkARCoreInstalled();
          if (!installed) {
            await _arcoreChannel!.requestARCoreInstall();
          }
          throw ARException('ARCore is not available on this device');
        }
        
        await _arcoreChannel!.initializeSession();
        await _arcoreChannel!.loadGlassesModel(widget.modelUrl, widget.productId);
        await _arcoreChannel!.updateFitParams(widget.initialFitParams);
      } else {
        throw ARException('AR is not supported on this platform');
      }

      setState(() => _isInitializing = false);
    } catch (e) {
      setState(() {
        _isInitializing = false;
        _errorMessage = e.toString();
      });
      widget.onError?.call();
    }
  }

  Future<void> _pauseSession() async {
    try {
      if (Platform.isIOS) {
        await _arkitChannel?.pauseSession();
      } else if (Platform.isAndroid) {
        await _arcoreChannel?.pauseSession();
      }
    } catch (e) {
      debugPrint('Failed to pause AR session: $e');
    }
  }

  Future<void> _resumeSession() async {
    try {
      if (Platform.isIOS) {
        await _arkitChannel?.resumeSession();
      } else if (Platform.isAndroid) {
        await _arcoreChannel?.resumeSession();
      }
    } catch (e) {
      debugPrint('Failed to resume AR session: $e');
    }
  }

  void _disposeAR() {
    _arkitChannel?.endSession();
    _arkitChannel?.dispose();
    _arcoreChannel?.endSession();
    _arcoreChannel?.dispose();
  }

  /// Update fit parameters
  Future<void> updateFitParams(ARFitParams params) async {
    try {
      if (Platform.isIOS) {
        await _arkitChannel?.updateFitParams(params);
      } else if (Platform.isAndroid) {
        await _arcoreChannel?.updateFitParams(params);
      }
    } catch (e) {
      debugPrint('Failed to update fit params: $e');
    }
  }

  /// Capture screenshot
  Future<String?> captureScreenshot() async {
    try {
      String? path;
      if (Platform.isIOS) {
        path = await _arkitChannel?.captureScreenshot();
      } else if (Platform.isAndroid) {
        path = await _arcoreChannel?.captureScreenshot();
      }
      if (path != null) {
        widget.onScreenshotCaptured?.call(path);
      }
      return path;
    } catch (e) {
      debugPrint('Failed to capture screenshot: $e');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isInitializing) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Initializing AR...'),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'AR Error',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _isInitializing = true;
                    _errorMessage = null;
                  });
                  _initializeAR();
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    // Platform-specific AR view
    if (Platform.isIOS) {
      return const _IOSARView();
    } else if (Platform.isAndroid) {
      return const _AndroidARView();
    }

    return const Center(child: Text('AR not supported'));
  }
}

/// iOS-specific AR view (placeholder for native view)
class _IOSARView extends StatelessWidget {
  const _IOSARView();

  @override
  Widget build(BuildContext context) {
    // This would be replaced with UiKitView for actual ARKit integration
    return Container(
      color: Colors.black,
      child: const Center(
        child: Text(
          'ARKit View\n(Native view placeholder)',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

/// Android-specific AR view (placeholder for native view)
class _AndroidARView extends StatelessWidget {
  const _AndroidARView();

  @override
  Widget build(BuildContext context) {
    // This would be replaced with AndroidView for actual ARCore integration
    return Container(
      color: Colors.black,
      child: const Center(
        child: Text(
          'ARCore View\n(Native view placeholder)',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}
