export type ARSessionStatus = 'idle' | 'initializing' | 'tracking' | 'error';

export interface ARFitParams {
  scale: number;
  offset_x: number;
  offset_y: number;
  offset_z: number;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
}

export interface ARSessionState {
  status: ARSessionStatus;
  is_face_tracked: boolean;
  is_model_loaded: boolean;
  current_model_id: string | null;
  error_message: string | null;
}

export interface FaceTrackingData {
  head_position_x: number;
  head_position_y: number;
  head_position_z: number;
  head_rotation_x: number;
  head_rotation_y: number;
  head_rotation_z: number;
  left_eye_x: number;
  left_eye_y: number;
  right_eye_x: number;
  right_eye_y: number;
  eye_distance: number;
  confidence: number;
}
