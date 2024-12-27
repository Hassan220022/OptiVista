import '../flutter_flow/flutter_flow_icon_button.dart';
import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'ar_feature_screen_model.dart';
export 'ar_feature_screen_model.dart';

class ArFeatureScreenWidget extends StatefulWidget {
  /// ### ✨ **AR Try-On Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **AR Try-On Screen** is the centerpiece of the application, allowing
  /// users to virtually try on eyewear in real-time. Leveraging augmented
  /// reality, this screen ensures an immersive, interactive experience with
  /// precise fitting and customization options.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **Immersive Experience**:
  ///    Deliver a realistic and engaging AR visualization to simulate
  /// real-world use.
  ///
  /// 2. **Ease of Use**:
  ///    Simple controls and intuitive layout for users to interact with AR
  /// features effortlessly.
  ///
  /// 3. **Customization**:
  ///    Offer options to adjust fit, capture images, and share results.
  ///
  /// 4. **Performance Optimization**:
  ///    Ensure smooth AR interactions with minimal latency.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Maintains consistency
  /// across the app.
  /// - **Accent Color**: Bright Green `#28A745` – Highlights key actions like
  /// capturing a snapshot.
  /// - **Background**: Transparent live camera feed – Integrates seamlessly
  /// with the real-world view.
  /// - **Text Color**: White `#FFFFFF` – High contrast for visibility over the
  /// camera feed.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **Live Camera Feed**
  ///    Provides a real-time AR view with eyewear overlays.
  ///
  /// 2. **Controls Overlay**
  ///    Interactive buttons for adjustments, image capture, and toggling
  /// features.
  ///
  /// 3. **Eyewear Options Bar**
  ///    Allows users to switch between different eyewear styles.
  ///
  /// 4. **Captured Image Preview (Optional)**
  ///    Displays snapshots for saving or sharing.
  ///
  /// ---
  ///
  /// ## 🖥️ **Detailed Description**
  ///
  /// ### **1. Live Camera Feed**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Camera View**        | Real-time feed with 3D eyewear overlay aligned
  /// to the user’s face.|
  /// | **Face Tracking**      | Automatically adjusts to the user’s head
  /// movements. |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Live Camera Feed]                                         |
  /// |  [AR Overlay: Sunglasses]                                  |
  /// |                                                            |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Controls Overlay**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Capture Button**     | Central circular button for taking snapshots of
  /// the AR view.|
  /// | **Adjust Fit Button**  | Opens a slider for scaling or repositioning the
  /// eyewear.|
  /// | **Exit Button**        | Closes the AR view and returns to the Product
  /// Details screen.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Exit Icon]    [Capture Button]    [Adjust Fit Icon]       |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. Eyewear Options Bar**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Thumbnail Selector** | Displays thumbnails of available eyewear
  /// styles.    |
  /// | **Scroll Interaction** | Allows users to swipe through and select
  /// styles.    |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Thumbnail 1] [Thumbnail 2] [Thumbnail 3] [Thumbnail 4]    |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Captured Image Preview (Optional)**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Preview Image**      | Shows the snapshot taken by the user.
  ///    |
  /// | **Save and Share Buttons** | Options to save the image to the gallery or
  /// share it via social media.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Captured Image]                                           |
  /// | [Save Button]      [Share Button]                         |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **Enter AR Try-On Mode**:
  ///    - Accessed via the "Try This in AR" button on the Product Details
  /// screen.
  ///
  /// 2. **Explore Eyewear Styles**:
  ///    - Swipe through the options bar to try different styles virtually.
  ///
  /// 3. **Adjust Fit**:
  ///    - Use the "Adjust Fit" button to resize or reposition the eyewear.
  ///
  /// 4. **Capture Image**:
  ///    - Take a snapshot of the AR view for saving or sharing.
  ///
  /// 5. **Exit AR Mode**:
  ///    - Click the exit button to return to the previous screen.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Smooth Eyewear Transition**:
  ///    - Eyewear overlays change fluidly as users switch styles.
  ///
  /// 2. **Capture Feedback**:
  ///    - Subtle flash effect when capturing a snapshot.
  ///
  /// 3. **Fit Adjustment Slider**:
  ///    - Slider animates into view when adjusting the fit.
  ///
  /// 4. **Face Tracking Feedback**:
  ///    - A light green bounding box appears momentarily during face alignment.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **Real-Time Face Tracking**:
  ///    - Ensures accurate and dynamic alignment of eyewear overlays.
  ///
  /// 2. **Customizable Fit**:
  ///    - Users can resize and reposition eyewear for the perfect look.
  ///
  /// 3. **Social Sharing**:
  ///    - Allows users to share their AR snapshots directly from the app.
  ///
  /// 4. **Style Switching**:
  ///    - Seamless transitions between multiple eyewear options.
  const ArFeatureScreenWidget({super.key});

  @override
  State<ArFeatureScreenWidget> createState() => _ArFeatureScreenWidgetState();
}

class _ArFeatureScreenWidgetState extends State<ArFeatureScreenWidget> {
  late ArFeatureScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ArFeatureScreenModel());
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: Colors.black,
        body: SizedBox(
          width: MediaQuery.sizeOf(context).width * 1.0,
          height: MediaQuery.sizeOf(context).height * 1.0,
          child: Stack(
            children: [
              Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: MediaQuery.sizeOf(context).height * 1.0,
                decoration: const BoxDecoration(
                  color: Colors.black,
                ),
                child: Image.network(
                  'https://images.unsplash.com/photo-1493820880000-a3fb709138a5?w=500&h=500',
                  width: MediaQuery.sizeOf(context).width * 1.0,
                  height: MediaQuery.sizeOf(context).height * 1.0,
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: MediaQuery.sizeOf(context).height * 1.0,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.transparent, Color(0x99000000)],
                    stops: [0.0, 1.0],
                    begin: AlignmentDirectional(0.0, 1.0),
                    end: AlignmentDirectional(0, -1.0),
                  ),
                ),
                child: Padding(
                  padding:
                      const EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 24.0, 24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          FlutterFlowIconButton(
                            borderRadius: 24.0,
                            buttonSize: 48.0,
                            fillColor: const Color(0x33FFFFFF),
                            icon: const Icon(
                              Icons.close,
                              color: Colors.white,
                              size: 24.0,
                            ),
                            onPressed: () {
                              print('IconButton pressed ...');
                            },
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              FlutterFlowIconButton(
                                borderRadius: 24.0,
                                buttonSize: 48.0,
                                fillColor: const Color(0x33FFFFFF),
                                icon: const Icon(
                                  Icons.flip_camera_ios,
                                  color: Colors.white,
                                  size: 24.0,
                                ),
                                onPressed: () {
                                  print('IconButton pressed ...');
                                },
                              ),
                              FlutterFlowIconButton(
                                borderRadius: 24.0,
                                buttonSize: 48.0,
                                fillColor: const Color(0x33FFFFFF),
                                icon: const Icon(
                                  Icons.tune,
                                  color: Colors.white,
                                  size: 24.0,
                                ),
                                onPressed: () {
                                  print('IconButton pressed ...');
                                },
                              ),
                            ].divide(const SizedBox(width: 16.0)),
                          ),
                        ],
                      ),
                      Column(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Material(
                                color: Colors.transparent,
                                elevation: 4.0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(36.0),
                                ),
                                child: Container(
                                  width: 72.0,
                                  height: 72.0,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF28A745),
                                    borderRadius: BorderRadius.circular(36.0),
                                  ),
                                  child: const Icon(
                                    Icons.camera,
                                    color: Colors.white,
                                    size: 32.0,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Container(
                            width: MediaQuery.sizeOf(context).width * 1.0,
                            height: 120.0,
                            decoration: const BoxDecoration(
                              color: Color(0xFF1A1A40),
                              borderRadius: BorderRadius.only(
                                bottomLeft: Radius.circular(0.0),
                                bottomRight: Radius.circular(0.0),
                                topLeft: Radius.circular(16.0),
                                topRight: Radius.circular(16.0),
                              ),
                            ),
                            child: Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(
                                  16.0, 16.0, 16.0, 16.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Text(
                                    'Try Different Styles',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: Colors.white,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                  SizedBox(
                                    height: 60.0,
                                    child: ListView(
                                      padding: const EdgeInsets.fromLTRB(
                                        12.0,
                                        0,
                                        12.0,
                                        0,
                                      ),
                                      primary: false,
                                      shrinkWrap: true,
                                      scrollDirection: Axis.horizontal,
                                      children: [
                                        Material(
                                          color: Colors.transparent,
                                          elevation: 2.0,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: Container(
                                            width: 60.0,
                                            height: 60.0,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              child: Image.network(
                                                'https://images.unsplash.com/photo-1513065200622-9a226a3c7adc?w=500&h=500',
                                                width: 60.0,
                                                height: 60.0,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                        Material(
                                          color: Colors.transparent,
                                          elevation: 2.0,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: Container(
                                            width: 60.0,
                                            height: 60.0,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              child: Image.network(
                                                'https://images.unsplash.com/photo-1522125123931-9304d91a42ee?w=500&h=500',
                                                width: 60.0,
                                                height: 60.0,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                        Material(
                                          color: Colors.transparent,
                                          elevation: 2.0,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: Container(
                                            width: 60.0,
                                            height: 60.0,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              child: Image.network(
                                                'https://images.unsplash.com/photo-1465077135029-626d853c33dc?w=500&h=500',
                                                width: 60.0,
                                                height: 60.0,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                        Material(
                                          color: Colors.transparent,
                                          elevation: 2.0,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: Container(
                                            width: 60.0,
                                            height: 60.0,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              child: Image.network(
                                                'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500&h=500',
                                                width: 60.0,
                                                height: 60.0,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                        Material(
                                          color: Colors.transparent,
                                          elevation: 2.0,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: Container(
                                            width: 60.0,
                                            height: 60.0,
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              child: Image.network(
                                                'https://images.unsplash.com/photo-1493903451767-ceba1e22f051?w=500&h=500',
                                                width: 60.0,
                                                height: 60.0,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ].divide(const SizedBox(width: 12.0)),
                                    ),
                                  ),
                                ].divide(const SizedBox(height: 16.0)),
                              ),
                            ),
                          ),
                        ].divide(const SizedBox(height: 24.0)),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: 100.0,
                decoration: const BoxDecoration(
                  color: Color(0x33000000),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(0.0),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(
                      sigmaX: 10.0,
                      sigmaY: 10.0,
                    ),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(
                          16.0, 24.0, 16.0, 24.0),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.face,
                                color: Color(0xFF28A745),
                                size: 24.0,
                              ),
                              Text(
                                'Face Detected',
                                style: FlutterFlowTheme.of(context)
                                    .bodySmall
                                    .override(
                                      fontFamily: 'Inter',
                                      color: Colors.white,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                            ],
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.gesture,
                                color: Colors.white,
                                size: 24.0,
                              ),
                              Text(
                                'Adjust Fit',
                                style: FlutterFlowTheme.of(context)
                                    .bodySmall
                                    .override(
                                      fontFamily: 'Inter',
                                      color: Colors.white,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                            ],
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.share,
                                color: Colors.white,
                                size: 24.0,
                              ),
                              Text(
                                'Share',
                                style: FlutterFlowTheme.of(context)
                                    .bodySmall
                                    .override(
                                      fontFamily: 'Inter',
                                      color: Colors.white,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
