import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:permission_handler/permission_handler.dart';

class ARTryOnScreen extends ConsumerStatefulWidget {
  final String productId;

  const ARTryOnScreen({
    super.key,
    required this.productId,
  });

  @override
  ConsumerState<ARTryOnScreen> createState() => _ARTryOnScreenState();
}

class _ARTryOnScreenState extends ConsumerState<ARTryOnScreen> {
  CameraController? _controller;
  bool _isCameraInitialized = false;
  bool _permissionDenied = false;

  @override
  void initState() {
    super.initState();
    _checkPermissionAndInitialize();
  }

  Future<void> _checkPermissionAndInitialize() async {
    final status = await Permission.camera.request();
    if (status.isGranted) {
      _initializeCamera();
    } else {
      if (mounted) {
        setState(() {
          _permissionDenied = true;
        });
      }
    }
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) return;

      final frontCamera = cameras.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => cameras.first,
      );

      _controller = CameraController(
        frontCamera,
        ResolutionPreset.high,
        enableAudio: false,
      );

      await _controller!.initialize();
      if (mounted) {
        setState(() {
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      debugPrint('Camera initialization failed: $e');
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  // State for Fit Adjustment
  double _scale = 1.0;
  double _baseScale = 1.0;
  Offset _position = Offset.zero;
  Offset _basePosition = Offset.zero;

  @override
  Widget build(BuildContext context) {
    if (_permissionDenied) {
      return Scaffold(
        backgroundColor: Colors.black,
        appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Camera permission is required for AR Try-On',
                style: TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => openAppSettings(),
                child: const Text('Open Settings'),
              ),
            ],
          ),
        ),
      );
    }

    if (!_isCameraInitialized || _controller == null) {
      return const Scaffold(
        backgroundColor: Colors.black,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          // Camera Preview
          SizedBox.expand(
            child: CameraPreview(_controller!),
          ),

          // AR Overlay with Fit Adjustment
          Positioned.fill(
            child: GestureDetector(
              onScaleStart: (details) {
                _baseScale = _scale;
                _basePosition = _position;
              },
              onScaleUpdate: (details) {
                setState(() {
                  _scale = (_baseScale * details.scale).clamp(0.5, 3.0);
                  _position = _basePosition + details.focalPointDelta;
                });
              },
              child: Container(
                color: Colors.transparent, // Ensure hits are detected
                child: Center(
                  child: Transform.translate(
                    offset: _position,
                    child: Transform.scale(
                      scale: _scale,
                      child: Container(
                        width: 300,
                        height: 150,
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: const Color(0xFF00E5FF).withOpacity(0.5),
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Center(
                          child: Text(
                            'AR Glasses Overlay',
                            style: TextStyle(
                              color: Color(0xFF00E5FF),
                              fontWeight: FontWeight.bold,
                              shadows: [
                                Shadow(blurRadius: 10, color: Colors.black),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // UI Controls
          SafeArea(
            child: Column(
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => context.pop(),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Live Try-On',
                          style: TextStyle(
                              color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.flip_camera_ios,
                            color: Colors.white),
                        onPressed: () {
                          // TODO: Switch camera
                        },
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // Bottom Controls
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black87],
                    ),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'Pinch to scale • Drag to move',
                        style: TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          FloatingActionButton(
                            onPressed: () {
                              // TODO: Capture photo
                            },
                            backgroundColor: Colors.white,
                            child: const Icon(Icons.camera_alt,
                                color: Colors.black),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
