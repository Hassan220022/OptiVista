import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'sign_up_screen_model.dart';
export 'sign_up_screen_model.dart';

class SignUpScreenWidget extends StatefulWidget {
  /// ### ✨ **Sign Up Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **Sign Up Screen** facilitates new user registration by offering
  /// multiple options, including manual input of credentials and Google Sign-Up
  /// for quick onboarding. This screen is designed to streamline account
  /// creation while maintaining a secure and engaging user experience.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **Ease of Use**:
  ///    Simplify the registration process to encourage user sign-ups.
  ///
  /// 2. **Multiple Onboarding Options**:
  ///    Provide manual input and Google Sign-Up to cater to different user
  /// preferences.
  ///
  /// 3. **Security and Trust**:
  ///    Highlight secure sign-up practices to build user confidence.
  ///
  /// 4. **Consistency and Flow**:
  ///    Create a seamless transition between sign-up and other screens like
  /// Sign In.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Professional and secure.
  /// - **Accent Color**: Bright Green `#28A745` – Draws attention to key
  /// actions like the "Sign Up" button.
  /// - **Secondary Accent**: Google Red `#DB4437` – Indicates Google-specific
  /// actions.
  /// - **Background**: White `#FFFFFF` – Clean and distraction-free.
  /// - **Text Color**: Dark Gray `#4A4A4A` – High readability.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **Header**
  ///    Welcomes users with a title and optional subtitle.
  ///
  /// 2. **Input Fields**
  ///    Collects user details: Name, Email, Password, and Confirm Password.
  ///
  /// 3. **Google Sign-Up**
  ///    A button to enable one-click registration via Google.
  ///
  /// 4. **Sign Up Button**
  ///    Completes the manual registration process.
  ///
  /// 5. **Alternative Actions**
  ///    Provides navigation to the Sign-In screen for existing users.
  ///
  /// 6. **Footer Text**
  ///    Mentions legal agreements like Terms and Privacy Policy.
  ///
  /// ---
  ///
  /// ## 🖥️ **Detailed Description**
  ///
  /// ### **1. Header**
  ///
  /// | **Element**           | **Description**
  ///         |
  /// |------------------------|----------------------------------------------------------|
  /// | **Screen Title**       | **"Create an Account"** – Bold and large.
  ///         |
  /// | **Subtitle**           | Text: "Join us and explore virtual eyewear in
  /// AR!"     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// |                    Create an Account                       |
  /// |    Join us and explore virtual eyewear in AR!              |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Input Fields**
  ///
  /// | **Field**             | **Description**
  /// |
  /// |-----------------------|--------------------------------------------------|
  /// | **Name Field**        | Placeholder: "Enter your full name."
  /// |
  /// | **Email Field**       | Placeholder: "Enter your email address."
  /// |
  /// | **Password Field**    | Placeholder: "Create a password."
  /// |
  /// | **Confirm Password**  | Placeholder: "Confirm your password."
  /// |
  ///
  /// #### **Design Notes**
  ///
  /// - All fields include validation checks for required formats (e.g., email
  /// structure, password strength).
  /// - Password fields have a toggle for showing/hiding input.
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Enter your full name]                                     |
  /// |                                                            |
  /// | [Enter your email address]                                 |
  /// |                                                            |
  /// | [Create a password]    [Show/Hide Icon]                   |
  /// |                                                            |
  /// | [Confirm your password] [Show/Hide Icon]                  |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. Google Sign-Up**
  ///
  /// | **Element**          | **Description**                              |
  /// |-----------------------|----------------------------------------------|
  /// | **Button Text**      | "Sign Up with Google"                        |
  /// | **Google Logo**      | Small logo placed to the left of the text.    |
  /// | **Action**           | Authenticates via Google OAuth and creates an
  /// account. |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Google Logo] Sign Up with Google                          |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Sign Up Button**
  ///
  /// | **Element**           | **Description**                              |
  /// |------------------------|----------------------------------------------|
  /// | **Button Text**       | "Sign Up"                                   |
  /// | **Action**            | Validates inputs and completes manual
  /// registration. |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Sign Up Button]                                           |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **5. Alternative Actions**
  ///
  /// | **Element**           | **Description**                              |
  /// |------------------------|----------------------------------------------|
  /// | **Text**              | "Already have an account? Sign In."          |
  /// | **Redirect**          | Navigates to the Sign-In screen.             |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Already have an account? [Sign In]                        |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **6. Footer Text**
  ///
  /// | **Element**           | **Description**                              |
  /// |------------------------|----------------------------------------------|
  /// | **Text**              | "By signing up, you agree to our Terms and
  /// Privacy Policy."|
  /// | **Links**             | Redirects to Terms of Service and Privacy Policy
  /// pages.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | By signing up, you agree to our [Terms] and [Privacy Policy].|
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **Manual Sign-Up**:
  ///    - Users input their details in the Name, Email, Password, and Confirm
  /// Password fields.
  ///    - Click "Sign Up" to complete the process after validation.
  ///
  /// 2. **Google Sign-Up**:
  ///    - Click "Sign Up with Google" to authenticate and auto-fill profile
  /// information.
  ///
  /// 3. **Switch to Sign-In**:
  ///    - Existing users can switch to the Sign-In screen via the provided
  /// link.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Google Button Hover Effect**:
  ///    - Changes to a lighter red shade with a slight elevation on hover.
  ///
  /// 2. **Input Field Focus**:
  ///    - Fields highlight with a soft border when active.
  ///
  /// 3. **Button Press Feedback**:
  ///    - "Sign Up" button darkens momentarily on tap.
  ///
  /// 4. **Validation Feedback**:
  ///    - Instant error messages for invalid email formats or mismatched
  /// passwords.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **Google Sign-Up**:
  ///    - Streamlined account creation using Google OAuth.
  ///
  /// 2. **Input Validation**:
  ///    - Real-time feedback ensures users input correct and secure
  /// information.
  ///
  /// 3. **Legal Links**:
  ///    - Transparent and accessible Terms and Privacy Policy.
  ///
  /// 4. **Multi-Path Onboarding**:
  ///    - Supports both manual and one-click registration.
  const SignUpScreenWidget({super.key});

  @override
  State<SignUpScreenWidget> createState() => _SignUpScreenWidgetState();
}

class _SignUpScreenWidgetState extends State<SignUpScreenWidget> {
  late SignUpScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SignUpScreenModel());

    _model.textController1 ??= TextEditingController();
    _model.textFieldFocusNode1 ??= FocusNode();

    _model.textController2 ??= TextEditingController();
    _model.textFieldFocusNode2 ??= FocusNode();

    _model.textController3 ??= TextEditingController();
    _model.textFieldFocusNode3 ??= FocusNode();

    _model.textController4 ??= TextEditingController();
    _model.textFieldFocusNode4 ??= FocusNode();
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
        body: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Container(
              width: MediaQuery.sizeOf(context).width * 1.0,
              height: MediaQuery.sizeOf(context).height * 1.0,
              decoration: BoxDecoration(
                color: FlutterFlowTheme.of(context).secondaryBackground,
              ),
              child: Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 24.0, 0.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: MediaQuery.sizeOf(context).width * 1.0,
                        height: 100.0,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF1A237E), Color(0xFF3F51B5)],
                            stops: [0.0, 1.0],
                            begin: AlignmentDirectional(0.0, -1.0),
                            end: AlignmentDirectional(0, 1.0),
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              24.0, 24.0, 24.0, 24.0),
                          child: SingleChildScrollView(
                            child: Column(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.end,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Create Account',
                                  style: FlutterFlowTheme.of(context)
                                      .headlineMedium
                                      .override(
                                        fontFamily: 'Inter Tight',
                                        color: Colors.white,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                Text(
                                  'Join us and explore virtual eyewear in AR!',
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Inter',
                                        color: const Color(0xFFE0E0E0),
                                        letterSpacing: 0.0,
                                      ),
                                ),
                              ],
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
                          width: MediaQuery.sizeOf(context).width * 1.0,
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
                              children: [
                                TextFormField(
                                  controller: _model.textController1,
                                  focusNode: _model.textFieldFocusNode1,
                                  autofocus: false,
                                  obscureText: false,
                                  decoration: InputDecoration(
                                    labelText: 'Full Name',
                                    labelStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    hintStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedErrorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    suffixIcon: const Icon(
                                      Icons.person,
                                    ),
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Inter',
                                        letterSpacing: 0.0,
                                      ),
                                  minLines: 1,
                                  validator: _model.textController1Validator
                                      .asValidator(context),
                                ),
                                TextFormField(
                                  controller: _model.textController2,
                                  focusNode: _model.textFieldFocusNode2,
                                  autofocus: false,
                                  obscureText: false,
                                  decoration: InputDecoration(
                                    labelText: 'Email Address',
                                    labelStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    hintStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedErrorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    suffixIcon: const Icon(
                                      Icons.email,
                                    ),
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Inter',
                                        letterSpacing: 0.0,
                                      ),
                                  minLines: 1,
                                  keyboardType: TextInputType.emailAddress,
                                  validator: _model.textController2Validator
                                      .asValidator(context),
                                ),
                                TextFormField(
                                  controller: _model.textController3,
                                  focusNode: _model.textFieldFocusNode3,
                                  autofocus: false,
                                  obscureText: !_model.passwordVisibility1,
                                  decoration: InputDecoration(
                                    labelText: 'Password',
                                    labelStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    hintStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedErrorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    suffixIcon: InkWell(
                                      onTap: () => safeSetState(
                                        () => _model.passwordVisibility1 =
                                            !_model.passwordVisibility1,
                                      ),
                                      focusNode: FocusNode(skipTraversal: true),
                                      child: Icon(
                                        _model.passwordVisibility1
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                        size: 22,
                                      ),
                                    ),
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Inter',
                                        letterSpacing: 0.0,
                                      ),
                                  minLines: 1,
                                  validator: _model.textController3Validator
                                      .asValidator(context),
                                ),
                                TextFormField(
                                  controller: _model.textController4,
                                  focusNode: _model.textFieldFocusNode4,
                                  autofocus: false,
                                  obscureText: !_model.passwordVisibility2,
                                  decoration: InputDecoration(
                                    labelText: 'Confirm Password',
                                    labelStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    hintStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0xFFE0E0E0),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    focusedErrorBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                        color: Color(0x00000000),
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    suffixIcon: InkWell(
                                      onTap: () => safeSetState(
                                        () => _model.passwordVisibility2 =
                                            !_model.passwordVisibility2,
                                      ),
                                      focusNode: FocusNode(skipTraversal: true),
                                      child: Icon(
                                        _model.passwordVisibility2
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                        size: 22,
                                      ),
                                    ),
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Inter',
                                        letterSpacing: 0.0,
                                      ),
                                  minLines: 1,
                                  validator: _model.textController4Validator
                                      .asValidator(context),
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
                          width: MediaQuery.sizeOf(context).width * 1.0,
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
                              children: [
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      16.0, 0.0, 16.0, 0.0),
                                  child: FFButtonWidget(
                                    onPressed: () {
                                      print('Button pressed ...');
                                    },
                                    text: 'Sign Up with Google',
                                    icon: const Icon(
                                      Icons.toggle_on,
                                      color: Colors.white,
                                      size: 15.0,
                                    ),
                                    options: FFButtonOptions(
                                      width: MediaQuery.sizeOf(context).width *
                                          1.0,
                                      height: 50.0,
                                      padding: const EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 0.0, 0.0),
                                      iconPadding:
                                          const EdgeInsetsDirectional.fromSTEB(
                                              0.0, 0.0, 0.0, 0.0),
                                      color: const Color(0xFFDB4437),
                                      textStyle: FlutterFlowTheme.of(context)
                                          .titleSmall
                                          .override(
                                            fontFamily: 'Inter Tight',
                                            color: Colors.white,
                                            letterSpacing: 0.0,
                                          ),
                                      elevation: 0.0,
                                      borderRadius: BorderRadius.circular(25.0),
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      16.0, 0.0, 16.0, 0.0),
                                  child: FFButtonWidget(
                                    onPressed: () {
                                      context.go('/homeScreen');
                                    },
                                    text: 'Create Account',
                                    options: FFButtonOptions(
                                      width: MediaQuery.sizeOf(context).width *
                                          1.0,
                                      height: 50.0,
                                      padding: const EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 0.0, 0.0),
                                      iconPadding:
                                          const EdgeInsetsDirectional.fromSTEB(
                                              0.0, 0.0, 0.0, 0.0),
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      textStyle: FlutterFlowTheme.of(context)
                                          .titleSmall
                                          .override(
                                            fontFamily: 'Inter Tight',
                                            color: Colors.white,
                                            letterSpacing: 0.0,
                                          ),
                                      elevation: 0.0,
                                      borderRadius: BorderRadius.circular(25.0),
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      16.0, 0.0, 16.0, 0.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Already have an account? ',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                      Text(
                                        'Sign In',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ].divide(const SizedBox(width: 4.0)),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      16.0, 0.0, 16.0, 0.0),
                                  child: Text(
                                    'By signing up, you agree to our Terms and Privacy Policy',
                                    textAlign: TextAlign.center,
                                    style: FlutterFlowTheme.of(context)
                                        .bodySmall
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryText,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ].divide(const SizedBox(height: 16.0)),
                            ),
                          ),
                        ),
                      ),
                    ].divide(const SizedBox(height: 24.0)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
