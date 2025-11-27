/// AR fit parameters for adjusting glasses position and scale
class ARFitParams {
  /// Scale factor for glasses (1.0 = original size)
  final double scale;

  /// Horizontal offset from center (negative = left, positive = right)
  final double offsetX;

  /// Vertical offset from center (negative = down, positive = up)
  final double offsetY;

  /// Depth offset (negative = closer, positive = further)
  final double offsetZ;

  /// Rotation around X axis (tilt forward/backward)
  final double rotationX;

  /// Rotation around Y axis (turn left/right)
  final double rotationY;

  /// Rotation around Z axis (tilt head)
  final double rotationZ;

  const ARFitParams({
    this.scale = 1.0,
    this.offsetX = 0.0,
    this.offsetY = 0.0,
    this.offsetZ = 0.0,
    this.rotationX = 0.0,
    this.rotationY = 0.0,
    this.rotationZ = 0.0,
  });

  /// Default fit params
  static const ARFitParams defaultParams = ARFitParams();

  factory ARFitParams.fromJson(Map<String, dynamic> json) {
    return ARFitParams(
      scale: (json['scale'] ?? 1.0).toDouble(),
      offsetX: (json['offsetX'] ?? 0.0).toDouble(),
      offsetY: (json['offsetY'] ?? 0.0).toDouble(),
      offsetZ: (json['offsetZ'] ?? 0.0).toDouble(),
      rotationX: (json['rotationX'] ?? 0.0).toDouble(),
      rotationY: (json['rotationY'] ?? 0.0).toDouble(),
      rotationZ: (json['rotationZ'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'scale': scale,
      'offsetX': offsetX,
      'offsetY': offsetY,
      'offsetZ': offsetZ,
      'rotationX': rotationX,
      'rotationY': rotationY,
      'rotationZ': rotationZ,
    };
  }

  ARFitParams copyWith({
    double? scale,
    double? offsetX,
    double? offsetY,
    double? offsetZ,
    double? rotationX,
    double? rotationY,
    double? rotationZ,
  }) {
    return ARFitParams(
      scale: scale ?? this.scale,
      offsetX: offsetX ?? this.offsetX,
      offsetY: offsetY ?? this.offsetY,
      offsetZ: offsetZ ?? this.offsetZ,
      rotationX: rotationX ?? this.rotationX,
      rotationY: rotationY ?? this.rotationY,
      rotationZ: rotationZ ?? this.rotationZ,
    );
  }

  /// Reset to default values
  ARFitParams reset() => defaultParams;

  /// Clamp values to valid ranges
  ARFitParams clamp() {
    return ARFitParams(
      scale: scale.clamp(0.5, 2.0),
      offsetX: offsetX.clamp(-1.0, 1.0),
      offsetY: offsetY.clamp(-1.0, 1.0),
      offsetZ: offsetZ.clamp(-1.0, 1.0),
      rotationX: rotationX.clamp(-45.0, 45.0),
      rotationY: rotationY.clamp(-45.0, 45.0),
      rotationZ: rotationZ.clamp(-45.0, 45.0),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ARFitParams &&
        other.scale == scale &&
        other.offsetX == offsetX &&
        other.offsetY == offsetY &&
        other.offsetZ == offsetZ &&
        other.rotationX == rotationX &&
        other.rotationY == rotationY &&
        other.rotationZ == rotationZ;
  }

  @override
  int get hashCode {
    return Object.hash(
      scale,
      offsetX,
      offsetY,
      offsetZ,
      rotationX,
      rotationY,
      rotationZ,
    );
  }

  @override
  String toString() {
    return 'ARFitParams(scale: $scale, offset: ($offsetX, $offsetY, $offsetZ), rotation: ($rotationX, $rotationY, $rotationZ))';
  }
}
