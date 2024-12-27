import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'welcome_screen_model.dart';
export 'welcome_screen_model.dart';

class WelcomeScreenWidget extends StatefulWidget {
  /// ### ✨ **Welcome Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **Welcome Screen** introduces users to the AR-Enhanced E-Commerce App,
  /// providing an engaging overview of its features, such as the ability to
  /// virtually try on eyewear using AR. It sets the stage for a user-friendly
  /// experience by allowing quick access to sign-in or sign-up options.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **First Impressions Matter**:
  ///    Deliver a visually appealing and inviting introduction to the app.
  ///
  /// 2. **Ease of Access**:
  ///    Streamline navigation to sign-in or sign-up processes for quick
  /// onboarding.
  ///
  /// 3. **Feature Highlighting**:
  ///    Briefly showcase the AR try-on feature to entice user engagement.
  ///
  /// 4. **Responsive and Accessible**:
  ///    Adapt seamlessly to various devices and user needs.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Professional and calming.
  /// - **Accent Color**: Vibrant Gold `#FFC857` – Attention-grabbing for key
  /// actions.
  /// - **Background**: Gradient from Light Blue `#E6F0FA` to White `#FFFFFF` –
  /// Inviting and clean.
  /// - **Text Color**: Charcoal `#2E2E2E` – High readability.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **App Logo and Tagline**
  ///    Reinforces brand identity.
  ///
  /// 2. **Feature Highlights Carousel**
  ///    Visually showcases the app’s key features with swipeable cards.
  ///
  /// 3. **Sign In and Sign Up Buttons**
  ///    Prominent actions to get users started.
  ///
  /// 4. **Call to Action Text**
  ///    Encourages users to explore the app's unique features.
  ///
  /// 5. **Footer Links**
  ///    Optional links for "Learn More," "Terms of Service," and "Privacy
  /// Policy."
  ///
  /// ---
  ///
  /// ## 🖥️ **Detailed Description**
  ///
  /// ### **1. App Logo and Tagline**
  ///
  /// | **Element**         | **Description**
  ///            |
  /// |----------------------|---------------------------------------------------------------|
  /// | **App Logo**         | Center-aligned logo, sized proportionally for
  /// prominence.     |
  /// | **Tagline**          | Text: "Try Before You Buy – Anytime, Anywhere."
  ///             |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// |                        [App Logo]                         |
  /// |                                                            |
  /// |             Try Before You Buy – Anytime, Anywhere.        |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Feature Highlights Carousel**
  ///
  /// | **Element**                  | **Description**
  ///                          |
  /// |-------------------------------|--------------------------------------------------------------------|
  /// | **Carousel Cards**           | Swipeable cards showing features like "AR
  /// Try-On" and "Exclusive Styles." |
  /// | **Illustrations/Icons**      | Accompanying visuals to make the
  /// highlights more engaging.        |
  /// | **Navigation Dots**          | Indicators to show which card is
  /// currently visible.               |
  ///
  /// #### **Example of a Feature Card**
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Image/Icon: User wearing AR glasses]                     |
  /// |                                                            |
  /// |  AR Try-On                                                |
  /// |  Virtually see yourself in your favorite eyewear styles.  |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. Sign In and Sign Up Buttons**
  ///
  /// | **Element**             | **Description**
  ///    |
  /// |--------------------------|--------------------------------------------------|
  /// | **Sign In Button**       | Primary action, styled with vibrant gold.
  ///    |
  /// | **Sign Up Button**       | Secondary action with an outlined style.
  ///    |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Sign In]    [Sign Up]                                     |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Call to Action Text**
  ///
  /// | **Element**             | **Description**
  ///    |
  /// |--------------------------|--------------------------------------------------|
  /// | **Text**                | Subtle text encouraging exploration: "Start
  /// your journey today!"|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// |  Start your journey today!                                |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **5. Footer Links**
  ///
  /// | **Element**             | **Description**
  ///    |
  /// |--------------------------|--------------------------------------------------|
  /// | **Link 1**              | "Learn More" – Navigates to an informational
  /// page.|
  /// | **Link 2**              | "Terms of Service" – Opens legal details.
  ///    |
  /// | **Link 3**              | "Privacy Policy" – Details user data
  /// practices.   |
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **Introduction to App Features**:
  ///    - Users are greeted with the tagline and carousel showcasing features.
  ///
  /// 2. **Sign In or Sign Up**:
  ///    - Prominent buttons direct users to authentication options.
  ///
  /// 3. **Optional Exploration**:
  ///    - Footer links provide additional resources about the app.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Carousel Transition**:
  ///    - Smooth swipe animations with fading effects.
  ///
  /// 2. **Button Interaction**:
  ///    - Buttons change color and elevate slightly on hover or tap.
  ///
  /// 3. **Logo Entry**:
  ///    - Logo animates in with a subtle fade and scale-up effect on screen
  /// load.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **Carousel Highlights**:
  ///    - Engages users by visually summarizing app features.
  ///
  /// 2. **Responsive Layout**:
  ///    - Ensures seamless display across all devices and screen sizes.
  ///
  /// 3. **Onboarding Call to Action**:
  ///    - Encourages user interaction and app exploration from the start.
  ///
  const WelcomeScreenWidget({super.key});

  @override
  State<WelcomeScreenWidget> createState() => _WelcomeScreenWidgetState();
}

class _WelcomeScreenWidgetState extends State<WelcomeScreenWidget> {
  late WelcomeScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => WelcomeScreenModel());
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
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SizedBox(
          width: MediaQuery.sizeOf(context).width * 1.0,
          height: MediaQuery.sizeOf(context).height * 1.0,
          child: Stack(
            children: [
              Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: MediaQuery.sizeOf(context).height * 1.0,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFFE6F0FA), Colors.white],
                    stops: [0.0, 1.0],
                    begin: AlignmentDirectional(0.0, -1.0),
                    end: AlignmentDirectional(0, 1.0),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 24.0, 0.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: SizedBox(
                          width: 160.0,
                          height: 160.0,
                          child: Image.network(
                            'https://images.unsplash.com/photo-1577616379008-c56a47d266bb?w=500&h=500',
                            width: 160.0,
                            height: 160.0,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: Text(
                          'Try Before You Buy',
                          style: FlutterFlowTheme.of(context)
                              .displaySmall
                              .override(
                                fontFamily: 'Inter Tight',
                                color: FlutterFlowTheme.of(context).primary,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: Text(
                          'Anytime, Anywhere',
                          style: FlutterFlowTheme.of(context)
                              .headlineSmall
                              .override(
                                fontFamily: 'Inter Tight',
                                color:
                                    FlutterFlowTheme.of(context).secondaryText,
                                letterSpacing: 0.0,
                              ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: SizedBox(
                          height: 240.0,
                          child: ListView(
                            padding: const EdgeInsets.fromLTRB(
                              16.0,
                              0,
                              16.0,
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
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Container(
                                  width: 300.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsetsDirectional.fromSTEB(
                                        24.0, 24.0, 24.0, 24.0),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Container(
                                          width: 100.0,
                                          height: 100.0,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .accent1,
                                            borderRadius:
                                                BorderRadius.circular(50.0),
                                          ),
                                          child: Icon(
                                            Icons.view_in_ar,
                                            color: FlutterFlowTheme.of(context)
                                                .primary,
                                            size: 48.0,
                                          ),
                                        ),
                                        Text(
                                          'AR Try-On',
                                          style: FlutterFlowTheme.of(context)
                                              .headlineSmall
                                              .override(
                                                fontFamily: 'Inter Tight',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                        Text(
                                          'See how frames look on you in real-time',
                                          textAlign: TextAlign.center,
                                          overflow: TextOverflow.ellipsis,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ].divide(const SizedBox(height: 16.0)),
                                    ),
                                  ),
                                ),
                              ),
                              Material(
                                color: Colors.transparent,
                                elevation: 2.0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Container(
                                  width: 300.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsetsDirectional.fromSTEB(
                                        24.0, 24.0, 24.0, 24.0),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Container(
                                          width: 100.0,
                                          height: 100.0,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .accent2,
                                            borderRadius:
                                                BorderRadius.circular(50.0),
                                          ),
                                          child: Icon(
                                            Icons.style,
                                            color: FlutterFlowTheme.of(context)
                                                .secondary,
                                            size: 48.0,
                                          ),
                                        ),
                                        Text(
                                          'Exclusive Styles',
                                          style: FlutterFlowTheme.of(context)
                                              .headlineSmall
                                              .override(
                                                fontFamily: 'Inter Tight',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                        Text(
                                          'Browse our curated collection of designer frames',
                                          textAlign: TextAlign.center,
                                          overflow: TextOverflow.ellipsis,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ].divide(const SizedBox(height: 16.0)),
                                    ),
                                  ),
                                ),
                              ),
                              Material(
                                color: Colors.transparent,
                                elevation: 2.0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Container(
                                  width: 300.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsetsDirectional.fromSTEB(
                                        24.0, 24.0, 24.0, 24.0),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Container(
                                          width: 100.0,
                                          height: 100.0,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .accent3,
                                            borderRadius:
                                                BorderRadius.circular(50.0),
                                          ),
                                          child: Icon(
                                            Icons.local_shipping,
                                            color: FlutterFlowTheme.of(context)
                                                .tertiary,
                                            size: 48.0,
                                          ),
                                        ),
                                        Text(
                                          'Free Shipping',
                                          style: FlutterFlowTheme.of(context)
                                              .headlineSmall
                                              .override(
                                                fontFamily: 'Inter Tight',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                        Text(
                                          'Try at home with our free shipping policy',
                                          textAlign: TextAlign.center,
                                          overflow: TextOverflow.ellipsis,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ].divide(const SizedBox(height: 16.0)),
                                    ),
                                  ),
                                ),
                              ),
                            ].divide(const SizedBox(width: 16.0)),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            FFButtonWidget(
                              onPressed: () {
                                context.go('/signInScreen');
                              },
                              text: 'Sign In',
                              options: FFButtonOptions(
                                width: MediaQuery.sizeOf(context).width * 1.0,
                                height: 56.0,
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color: FlutterFlowTheme.of(context).primary,
                                textStyle: FlutterFlowTheme.of(context)
                                    .titleMedium
                                    .override(
                                      fontFamily: 'Inter Tight',
                                      color: FlutterFlowTheme.of(context).info,
                                      letterSpacing: 0.0,
                                    ),
                                elevation: 0.0,
                                borderRadius: BorderRadius.circular(28.0),
                              ),
                            ),
                            FFButtonWidget(
                              onPressed: () {
                                context.go('/signUpScreen');
                              },
                              text: 'Create Account',
                              options: FFButtonOptions(
                                width: MediaQuery.sizeOf(context).width * 1.0,
                                height: 56.0,
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color: const Color(0x00FFFFFF),
                                textStyle: FlutterFlowTheme.of(context)
                                    .titleMedium
                                    .override(
                                      fontFamily: 'Inter Tight',
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      letterSpacing: 0.0,
                                    ),
                                elevation: 0.0,
                                borderSide: BorderSide(
                                  color: FlutterFlowTheme.of(context).primary,
                                  width: 2.0,
                                ),
                                borderRadius: BorderRadius.circular(28.0),
                              ),
                            ),
                          ].divide(const SizedBox(height: 16.0)),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            48.0, 0.0, 48.0, 0.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              'By continuing, you agree to our',
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Text(
                                  'Terms of Service',
                                  style: FlutterFlowTheme.of(context)
                                      .bodySmall
                                      .override(
                                        fontFamily: 'Inter',
                                        color: FlutterFlowTheme.of(context)
                                            .primary,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                                Text(
                                  'and',
                                  style: FlutterFlowTheme.of(context)
                                      .bodySmall
                                      .override(
                                        fontFamily: 'Inter',
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryText,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                                Text(
                                  'Privacy Policy',
                                  style: FlutterFlowTheme.of(context)
                                      .bodySmall
                                      .override(
                                        fontFamily: 'Inter',
                                        color: FlutterFlowTheme.of(context)
                                            .primary,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                              ].divide(const SizedBox(width: 4.0)),
                            ),
                          ].divide(const SizedBox(height: 8.0)),
                        ),
                      ),
                    ].divide(const SizedBox(height: 32.0)),
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
