/// AR session state enumeration
enum ARSessionStatus {
  notStarted,
  initializing,
  running,
  paused,
  error,
  ended,
}

/// AR session state model
class ARSessionState {
  final ARSessionStatus status;
  final bool isFaceTracked;
  final bool isModelLoaded;
  final String? currentModelId;
  final String? errorMessage;
  final FaceTrackingData? faceData;

  const ARSessionState({
    this.status = ARSessionStatus.notStarted,
    this.isFaceTracked = false,
    this.isModelLoaded = false,
    this.currentModelId,
    this.errorMessage,
    this.faceData,
  });

  factory ARSessionState.fromJson(Map<String, dynamic> json) {
    return ARSessionState(
      status: ARSessionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => ARSessionStatus.notStarted,
      ),
      isFaceTracked: json['isFaceTracked'] ?? false,
      isModelLoaded: json['isModelLoaded'] ?? false,
      currentModelId: json['currentModelId'],
      errorMessage: json['errorMessage'],
      faceData: json['faceData'] != null
          ? FaceTrackingData.fromJson(json['faceData'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status.name,
      'isFaceTracked': isFaceTracked,
      'isModelLoaded': isModelLoaded,
      'currentModelId': currentModelId,
      'errorMessage': errorMessage,
      'faceData': faceData?.toJson(),
    };
  }

  ARSessionState copyWith({
    ARSessionStatus? status,
    bool? isFaceTracked,
    bool? isModelLoaded,
    String? currentModelId,
    String? errorMessage,
    FaceTrackingData? faceData,
  }) {
    return ARSessionState(
      status: status ?? this.status,
      isFaceTracked: isFaceTracked ?? this.isFaceTracked,
      isModelLoaded: isModelLoaded ?? this.isModelLoaded,
      currentModelId: currentModelId ?? this.currentModelId,
      errorMessage: errorMessage ?? this.errorMessage,
      faceData: faceData ?? this.faceData,
    );
  }

  /// Check if session is active
  bool get isActive =>
      status == ARSessionStatus.running || status == ARSessionStatus.paused;

  /// Check if ready for AR overlay
  bool get isReadyForOverlay => isActive && isFaceTracked && isModelLoaded;
}

/// Face tracking data from AR session
class FaceTrackingData {
  final double headPositionX;
  final double headPositionY;
  final double headPositionZ;
  final double headRotationX;
  final double headRotationY;
  final double headRotationZ;
  final double leftEyeX;
  final double leftEyeY;
  final double rightEyeX;
  final double rightEyeY;
  final double eyeDistance;
  final double confidence;

  const FaceTrackingData({
    required this.headPositionX,
    required this.headPositionY,
    required this.headPositionZ,
    required this.headRotationX,
    required this.headRotationY,
    required this.headRotationZ,
    required this.leftEyeX,
    required this.leftEyeY,
    required this.rightEyeX,
    required this.rightEyeY,
    required this.eyeDistance,
    required this.confidence,
  });

  factory FaceTrackingData.fromJson(Map<String, dynamic> json) {
    return FaceTrackingData(
      headPositionX: (json['headPositionX'] ?? 0).toDouble(),
      headPositionY: (json['headPositionY'] ?? 0).toDouble(),
      headPositionZ: (json['headPositionZ'] ?? 0).toDouble(),
      headRotationX: (json['headRotationX'] ?? 0).toDouble(),
      headRotationY: (json['headRotationY'] ?? 0).toDouble(),
      headRotationZ: (json['headRotationZ'] ?? 0).toDouble(),
      leftEyeX: (json['leftEyeX'] ?? 0).toDouble(),
      leftEyeY: (json['leftEyeY'] ?? 0).toDouble(),
      rightEyeX: (json['rightEyeX'] ?? 0).toDouble(),
      rightEyeY: (json['rightEyeY'] ?? 0).toDouble(),
      eyeDistance: (json['eyeDistance'] ?? 0).toDouble(),
      confidence: (json['confidence'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'headPositionX': headPositionX,
      'headPositionY': headPositionY,
      'headPositionZ': headPositionZ,
      'headRotationX': headRotationX,
      'headRotationY': headRotationY,
      'headRotationZ': headRotationZ,
      'leftEyeX': leftEyeX,
      'leftEyeY': leftEyeY,
      'rightEyeX': rightEyeX,
      'rightEyeY': rightEyeY,
      'eyeDistance': eyeDistance,
      'confidence': confidence,
    };
  }
}
