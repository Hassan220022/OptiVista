# AR Try-On Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the AR try-on feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a Flutter + AR integration architect.

## Feature Configuration

```
Feature name: ar_tryon
Folders:
  - apps/frontend/lib/features/ar_tryon/
  - apps/frontend/lib/ar_integration/
```

## Goal

Design the AR Try-On flow that opens the camera, connects to native AR (ARKit/ARCore/Unity), renders glasses on the user's face, and lets user adjust and capture photos.

---

## Instructions

### 1. AR Integration Structure

Under `lib/ar_integration/`:

#### `channels/ar_method_channel.dart`

Platform channel interface:

**Methods (Flutter → Native)**:
| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| `startSession` | ARAssetConfig | bool | Initialize AR with asset |
| `stopSession` | - | bool | Clean up AR session |
| `changeFrame` | ARAssetConfig | bool | Switch to different frame |
| `adjustFit` | scale, verticalOffset | bool | Update positioning |
| `takeSnapshot` | - | String (path) | Capture current view |
| `checkSupport` | - | ARSupportResult | Verify device capability |

**Events (Native → Flutter)**:
| Event | Data | Purpose |
|-------|------|---------|
| `sessionReady` | - | AR session initialized |
| `trackingStateChanged` | TrackingState | Face tracking status |
| `error` | code, message | Error occurred |

#### `models/ar_asset_config.dart`

`ARAssetConfig`:
| Field | Type | Purpose |
|-------|------|---------|
| `assetUrl` | String | URL to 3D model file |
| `defaultScale` | double | Initial sizing factor |
| `defaultVerticalOffset` | double | Initial Y position |
| `defaultHorizontalOffset` | double | Initial X position |
| `supportedPlatforms` | List<String> | ios, android, all |

#### `models/ar_session_state.dart`

`ARSessionState`:
| Field | Type | Purpose |
|-------|------|---------|
| `status` | ARStatus enum | notStarted, initializing, ready, error |
| `trackingState` | TrackingState enum | notTracking, limited, normal |
| `errorCode` | String? | Error identifier |
| `errorMessage` | String? | User-friendly error |

#### `widgets/ar_view_container.dart`

`ARViewContainer`:
- Hosts native AR view (PlatformView or embedded Unity)
- Exposes lifecycle callbacks: `onReady`, `onError`, `onTrackingChanged`
- Handles platform-specific view creation
- Manages view lifecycle with screen visibility

---

### 2. AR Try-On Feature Module

Under `lib/features/ar_tryon/`:

#### `presentation/screens/ar_tryon_screen.dart`

**Receives**:
- `productId` and `variantId` from navigation
- Or full `ProductVariant` + `ARAssetConfig` object

**Layout** (Stack-based):
```
Stack:
├── ARViewContainer (full screen)
├── SafeArea
│   ├── Top Bar
│   │   ├── Back button
│   │   ├── Product name
│   │   └── Variant thumbnail
│   ├── Center (conditional)
│   │   └── Guidance text overlay
│   └── Bottom Panel
│       ├── Variant color selector
│       ├── Fit adjustment controls
│       └── Capture button
```

**States to Handle**:
| State | UI Display |
|-------|------------|
| Checking Support | Loading indicator, "Checking AR capability..." |
| Permission Needed | Permission request overlay |
| Not Supported | "Device doesn't support AR" message |
| Initializing | Loading overlay on camera view |
| Tracking | Full controls visible, normal operation |
| Tracking Lost | Guidance text: "Align your face in the frame" |
| Error | Error message with retry option |

---

### 3. Nested Widgets

Under `presentation/widgets/`:

| Widget | File | Purpose |
|--------|------|---------|
| `ARControlsOverlay` | `ar_controls_overlay.dart` | Bottom panel with all controls |
| `FrameVariantPicker` | `frame_variant_picker.dart` | Horizontal color/variant selector |
| `FitControlBar` | `fit_control_bar.dart` | Scale and position sliders |
| `CaptureButton` | `capture_button.dart` | Large circular screenshot button |
| `ARGuidanceText` | `ar_guidance_text.dart` | Contextual help text |
| `ARLoadingOverlay` | `ar_loading_overlay.dart` | Loading state overlay |
| `ARErrorView` | `ar_error_view.dart` | Error state with retry |

#### `ARControlsOverlay`
- Semi-transparent bottom sheet style
- Rounded top corners
- Contains variant picker, fit controls, capture button
- Collapsible for more camera view

#### `FrameVariantPicker`
- Horizontal scrollable list
- Color swatches or thumbnails
- Selected indicator ring
- Tapping triggers `changeVariant` action

#### `FitControlBar`
- Scale slider: 0.8x to 1.2x
- Vertical position slider: -0.5 to +0.5
- Reset button to restore defaults
- Real-time updates to AR view

#### `CaptureButton`
- Large circular button (64dp+)
- Camera icon
- Loading spinner during capture
- Success animation (flash effect)

#### `ARGuidanceText`
- Animated appearance/disappearance
- Positioned to not block face area
- Messages:
  - "Center your face in the frame"
  - "Move closer to the camera"
  - "Better lighting needed"
  - "Hold still"

---

### 4. State Management

#### `ARTryOnController` (`presentation/controllers/ar_tryon_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `product` | Product | Current product |
| `currentVariant` | ProductVariant | Selected variant |
| `arAssetConfig` | ARAssetConfig? | Loaded AR config |
| `sessionState` | ARSessionState | Current AR status |
| `fitSettings` | FitSettings | Scale and offset values |
| `isSnapshotSaving` | bool | Capture in progress |
| `lastSnapshotPath` | String? | Last captured image |
| `hasPermission` | bool | Camera permission status |
| `isSupported` | bool | Device AR support |
| `errorMessage` | String? | Error to display |

`FitSettings`:
| Field | Type | Default |
|-------|------|---------|
| `scale` | double | 1.0 |
| `verticalOffset` | double | 0.0 |
| `horizontalOffset` | double | 0.0 |

**Actions**:
| Action | Purpose |
|--------|---------|
| `checkPermissionAndSupport()` | Verify camera + AR capability |
| `requestCameraPermission()` | Trigger permission dialog |
| `initSession()` | Fetch AR config and start session |
| `stopSession()` | Clean up on dispose |
| `changeVariant(variant)` | Update variant and call native |
| `updateFit(settings)` | Adjust scale/offset |
| `resetFit()` | Restore default values |
| `captureSnapshot()` | Take screenshot |
| `shareSnapshot(path)` | Open share sheet |
| `saveToGallery(path)` | Save to device photos |

---

### 5. Permissions & Errors

#### Permission Flow
1. Check camera permission on screen load
2. If not granted, show explanatory overlay
3. "Grant Access" button triggers system permission
4. If denied, show "Go to Settings" option
5. If granted, proceed to AR init

#### Device Not Supported
- Show friendly message explaining why
- Offer fallback: "View product photos instead"
- Button to return to product details

#### Error Recovery
| Error | Recovery |
|-------|----------|
| Session init failed | Retry button |
| Model load failed | Retry with fallback asset |
| Tracking lost | Guidance text, auto-recover |
| Snapshot failed | Retry, error toast |

---

### 6. UX Details

#### First-Time Hints
On first AR use, show overlay hints:
- "Move your head slowly"
- "Use the slider to adjust fit"
- "Tap the button to capture"
- Dismissible, don't show again

#### Loading Experience
- Show branded loading animation
- Display progress if downloading model
- "This may take a moment" for large models

#### Capture Flow
1. User taps capture button
2. Flash animation on screen
3. Brief freeze frame
4. Thumbnail slides in from corner
5. Options: Share, Save, Retake
6. Dismiss returns to AR view

#### Exit Flow
- Back button stops session cleanly
- Confirm if unsaved capture exists
- Return to product details

---

## Expected Output

### Directory Tree

```
ar_integration/
├── channels/
│   └── ar_method_channel.dart
├── models/
│   ├── ar_asset_config.dart
│   ├── ar_session_state.dart
│   ├── ar_support_result.dart
│   └── fit_settings.dart
└── widgets/
    └── ar_view_container.dart

features/ar_tryon/
├── presentation/
│   ├── screens/
│   │   └── ar_tryon_screen.dart
│   ├── widgets/
│   │   ├── ar_controls_overlay.dart
│   │   ├── frame_variant_picker.dart
│   │   ├── fit_control_bar.dart
│   │   ├── capture_button.dart
│   │   ├── ar_guidance_text.dart
│   │   ├── ar_loading_overlay.dart
│   │   └── ar_error_view.dart
│   └── controllers/
│       ├── ar_tryon_controller.dart
│       └── ar_capture_controller.dart
├── data/
│   └── repositories/
│       └── ar_asset_repository.dart
└── domain/
    └── entities/
        └── ar_session.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Platform channel method contracts
- State machine for AR session
- Widget composition and interactions
- Error handling flows

**No Dart or native code** - only detailed descriptions.
