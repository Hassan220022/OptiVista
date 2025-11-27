# AR Try-On Feature Prompt

> **Usage**: Use this dedicated prompt for the AR Try-On feature, which requires special handling for camera and native platform integration.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a Flutter + AR integration architect.

## Feature Configuration

```
Feature: AR Try-On
Folders: 
  - apps/frontend/lib/features/ar_tryon/
  - apps/frontend/lib/ar_integration/
```

## Goal

Define the full frontend structure to:
- Open front camera
- Connect to ARKit (iOS) / ARCore or Unity AR (Android) via platform channels or embedded Unity view
- Render 3D glasses aligned with user face
- Allow switching frame variants, adjusting fit, capturing screenshots

---

## Task 1: AR Integration Layer

### Define `ar_integration/` Structure

```
lib/ar_integration/
├── channels/       # Platform channel definitions
├── models/         # AR-related data models
└── widgets/        # AR view container widgets
```

### `channels/`

Define platform channel interface:

| Method | Direction | Purpose |
|--------|-----------|---------|
| `startSession` | Flutter → Native | Initialize AR session with asset ID |
| `stopSession` | Flutter → Native | Clean up AR session |
| `changeFrame` | Flutter → Native | Switch to different frame variant |
| `setFitAdjustment` | Flutter → Native | Update scale/offset values |
| `takeSnapshot` | Flutter → Native | Capture current AR view |
| `checkSupport` | Flutter → Native | Verify device AR capability |

| Event | Direction | Purpose |
|-------|-----------|---------|
| `sessionReady` | Native → Flutter | AR session initialized |
| `trackingStateChanged` | Native → Flutter | Face tracking status update |
| `error` | Native → Flutter | AR error occurred |
| `snapshotCaptured` | Native → Flutter | Screenshot saved, returns path |

Define:
- Method channel name convention
- Event channel name convention
- Error codes and their meanings
- Platform-specific handling (iOS vs Android)

### `models/`

| Model | Fields | Purpose |
|-------|--------|---------|
| `ARFrameVariant` | `id`, `modelUrl`, `defaultScale`, `defaultOffset`, `color` | AR asset configuration |
| `FaceFitSettings` | `scale`, `verticalOffset`, `horizontalOffset` | User adjustments |
| `ARSessionState` | `status`, `trackingQuality`, `errorMessage` | Current session state |
| `TrackingState` | enum: `notTracking`, `limited`, `normal` | Face tracking quality |
| `ARCapability` | `isSupported`, `reason` | Device support info |

### `widgets/`

| Widget | Purpose |
|--------|---------|
| `ARViewContainer` | Hosts native AR view (PlatformView or texture) |
| `AROverlayWrapper` | Positions Flutter UI over AR view |

---

## Task 2: AR Try-On Feature Module

### Define `features/ar_tryon/` Structure

```
features/ar_tryon/
├── presentation/
│   ├── screens/
│   │   └── ar_tryon_screen.dart
│   ├── widgets/
│   │   ├── ar_controls_overlay.dart
│   │   ├── frame_variant_picker.dart
│   │   ├── fit_adjustment_slider.dart
│   │   ├── capture_button.dart
│   │   └── ar_guidance_text.dart
│   └── controllers/
│       ├── ar_session_controller.dart
│       └── ar_capture_controller.dart
├── data/
│   ├── models/
│   │   └── ar_product_asset.dart
│   └── repositories/
│       └── ar_asset_repository.dart
└── domain/
    └── entities/
        └── ar_session.dart
```

### Main Screen: `ar_tryon_screen.dart`

**Responsibilities**:
- Receive selected Product / AR asset ID from navigation
- Request camera permission if not granted
- Check AR device support
- Initialize AR session via platform channel
- Display AR view with UI overlay
- React to AR session lifecycle events
- Handle back navigation / session cleanup

**UI Structure**:
```
Stack:
├── ARViewContainer (full screen camera + AR)
├── SafeArea
│   ├── Top: Back button, product name
│   ├── Center: Guidance text (when needed)
│   └── Bottom: Controls overlay
│       ├── Frame variant picker (horizontal scroll)
│       ├── Fit adjustment controls
│       └── Capture button
```

**States to Handle**:
1. **Checking Support**: Show loading, verify AR capability
2. **Permission Needed**: Show camera permission request UI
3. **Not Supported**: Show device not supported message with exit option
4. **Initializing**: Show loading overlay while AR session starts
5. **Tracking**: Normal operation, show controls
6. **Tracking Lost**: Show "Align your face" guidance
7. **Error**: Show error message with retry option

### Controllers

#### `ar_session_controller.dart`

**State Fields**:
- `sessionState`: ARSessionState
- `currentVariant`: ARFrameVariant
- `fitSettings`: FaceFitSettings
- `isSupported`: bool
- `hasPermission`: bool

**Methods**:
- `checkDeviceSupport()`: Verify AR capability
- `requestCameraPermission()`: Handle permission flow
- `startSession(assetId)`: Initialize AR with asset
- `stopSession()`: Clean up resources
- `changeVariant(variant)`: Switch frame
- `updateFitSettings(settings)`: Adjust scale/offset

#### `ar_capture_controller.dart`

**State Fields**:
- `isCapturing`: bool
- `lastCapturedPath`: String?
- `captureError`: String?

**Methods**:
- `captureScreenshot()`: Take snapshot of AR view
- `shareCapture(path)`: Open share sheet
- `saveToGallery(path)`: Save to device photos

### Widgets

#### `ar_controls_overlay.dart`
- Bottom sheet-style overlay with rounded top corners
- Contains variant picker, sliders, and capture button
- Semi-transparent background

#### `frame_variant_picker.dart`
- Horizontal scrollable list of color/variant options
- Each option shows color swatch or thumbnail
- Selected state indicator
- Tapping switches frame via controller

#### `fit_adjustment_slider.dart`
- Scale slider (0.8x to 1.2x)
- Vertical position slider
- Reset to default button
- Real-time updates to AR view

#### `capture_button.dart`
- Large circular button
- Camera icon
- Loading state during capture
- Success animation on capture

#### `ar_guidance_text.dart`
- Contextual guidance text
- "Center your face in the frame"
- "Move closer to the camera"
- "Good lighting needed"
- Appears/disappears based on tracking state

---

## Task 3: Flutter ↔ Native Interface Details

### Method Channel Definition

```
Channel Name: com.optivista.ar/methods

Methods:
├── startSession(Map)
│   ├── Input: { assetId: String, modelUrl: String, calibration: Map }
│   └── Returns: { success: bool, error?: String }
│
├── stopSession()
│   └── Returns: { success: bool }
│
├── changeFrame(Map)
│   ├── Input: { modelUrl: String, calibration: Map }
│   └── Returns: { success: bool }
│
├── setFitAdjustment(Map)
│   ├── Input: { scale: double, verticalOffset: double }
│   └── Returns: { success: bool }
│
├── takeSnapshot()
│   └── Returns: { success: bool, path?: String, error?: String }
│
└── checkSupport()
    └── Returns: { supported: bool, reason?: String }
```

### Event Channel Definition

```
Channel Name: com.optivista.ar/events

Events (streamed):
├── { type: "sessionReady" }
├── { type: "trackingStateChanged", state: "normal|limited|notTracking" }
├── { type: "error", code: String, message: String }
└── { type: "snapshotCaptured", path: String }
```

### Error Codes

| Code | Meaning | User Message |
|------|---------|--------------|
| `AR_NOT_SUPPORTED` | Device lacks AR capability | "Your device doesn't support AR" |
| `CAMERA_PERMISSION_DENIED` | Camera access denied | "Camera access is required" |
| `SESSION_FAILED` | AR session init failed | "Failed to start AR. Please retry" |
| `MODEL_LOAD_FAILED` | 3D model couldn't load | "Failed to load glasses model" |
| `TRACKING_FAILED` | Face tracking error | "Face tracking lost" |
| `SNAPSHOT_FAILED` | Screenshot capture failed | "Failed to capture image" |

---

## Task 4: AR UX Details

### Loading States
- Show branded loading animation while AR initializes
- Estimated time indicator if > 2 seconds
- Cancel option available

### Device Not Supported
- Clear explanation of why (old device, missing sensor)
- Alternative: Show static product images instead
- Link to product details

### Guidance Text Patterns
- Appear after 2 seconds of poor tracking
- Animate in/out smoothly
- Positioned to not block face area
- Auto-dismiss when tracking resumes

### Screenshot Flow
1. User taps capture button
2. Flash animation on screen
3. Thumbnail preview slides in from bottom
4. Options: Share, Save, Retake
5. After action, returns to AR view

---

## Expected Output

1. **Directory structure** for `ar_integration/` and `features/ar_tryon/`
2. **Detailed responsibilities** per file, controller, and widget
3. **Platform channel contract** clearly defined
4. **UX state machine** documented
5. **No native or Dart code** - only detailed descriptions
