import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'forget_password_screen_model.dart';
export 'forget_password_screen_model.dart';

class ForgetPasswordScreenWidget extends StatefulWidget {
  /// ### ✨ **Forgot Password Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **Forgot Password Screen** enables users to recover access to their
  /// accounts by securely resetting their password. The design prioritizes
  /// simplicity, security, and guidance to ensure users can complete the
  /// process without frustration.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **Ease of Use**:
  ///    Provide clear instructions to help users recover their account quickly.
  ///
  /// 2. **Security**:
  ///    Ensure the process is secure by verifying user identity through email.
  ///
  /// 3. **Accessibility**:
  ///    Design the screen to be intuitive and easy to navigate for all users.
  ///
  /// 4. **Consistency**:
  ///    Align design elements with the app’s overall aesthetic for familiarity.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Professional and calming.
  /// - **Accent Color**: Bright Green `#28A745` – Highlights the "Reset
  /// Password" button.
  /// - **Background**: White `#FFFFFF` – Clean and distraction-free.
  /// - **Text Color**: Charcoal `#333333` – Readable and neutral.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **Header**
  ///    Displays the screen title and a brief explanation of the process.
  ///
  /// 2. **Email Input Field**
  ///    Collects the user’s registered email address for verification.
  ///
  /// 3. **Submit Button**
  ///    Sends the password reset request to the provided email.
  ///
  /// 4. **Confirmation Message (Post-Submission)**
  ///    Confirms that an email has been sent with reset instructions.
  ///
  /// 5. **Back to Sign In Option**
  ///    Provides a link to return to the Sign-In screen.
  ///
  /// ---
  ///
  /// ## 🖥️ **Detailed Description**
  ///
  /// ### **1. Header**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Screen Title**       | Displays "Forgot Password" prominently at the
  /// top.  |
  /// | **Subtitle**           | Text: "Enter your email address to reset your
  /// password."|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Forgot Password                                            |
  /// | Enter your email address to reset your password.           |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Email Input Field**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Email Field**        | Placeholder: "Enter your email address."
  ///     |
  /// | **Validation Feedback**| Provides real-time feedback for invalid email
  /// formats.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Enter your email address]                                 |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. Submit Button**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Button Text**        | "Reset Password"
  ///     |
  /// | **Action**             | Sends a password reset link to the entered
  /// email.   |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Reset Password Button]                                    |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Confirmation Message (Post-Submission)**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Message Text**       | Example: "A password reset link has been sent
  /// to your email."|
  /// | **Action Reminder**    | Suggests checking the spam folder if the email
  /// isn’t received.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | A password reset link has been sent to your email.         |
  /// | Please check your inbox (and spam folder).                 |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **5. Back to Sign In Option**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Text Link**          | Example: "Remember your password? Sign In."
  ///     |
  /// | **Action**             | Navigates back to the Sign-In screen.
  ///     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Remember your password? [Sign In]                         |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **Enter Email**:
  ///    - Users input their registered email address.
  ///
  /// 2. **Submit Request**:
  ///    - Click "Reset Password" to send a password reset link to their email.
  ///
  /// 3. **Confirmation**:
  ///    - Users see a confirmation message about the email being sent.
  ///
  /// 4. **Return to Sign-In**:
  ///    - Optionally navigate back to the Sign-In screen.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Field Validation Feedback**:
  ///    - Real-time checks for proper email formatting with error messages for
  /// invalid inputs.
  ///
  /// 2. **Button Press Feedback**:
  ///    - Subtle animation when the "Reset Password" button is clicked.
  ///
  /// 3. **Confirmation Message Fade-In**:
  ///    - Message appears with a fade-in effect after successful submission.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **Real-Time Validation**:
  ///    - Helps users avoid errors by ensuring the email format is correct.
  ///
  /// 2. **Clear Confirmation**:
  ///    - Provides clear messaging to reassure users that their request was
  /// successful.
  ///
  /// 3. **Quick Navigation**:
  ///    - Direct link back to the Sign-In screen for users who remember their
  /// password.
  ///
  /// 4. **Guidance**:
  ///    - Tips for checking spam folders ensure users don’t miss the reset
  /// email.
  const ForgetPasswordScreenWidget({super.key});

  @override
  State<ForgetPasswordScreenWidget> createState() =>
      _ForgetPasswordScreenWidgetState();
}

class _ForgetPasswordScreenWidgetState
    extends State<ForgetPasswordScreenWidget> {
  late ForgetPasswordScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ForgetPasswordScreenModel());

    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();
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
        appBar: AppBar(
          backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
          automaticallyImplyLeading: false,
          leading: IconButton(
            icon: Icon(
              Icons.arrow_back,
              color: FlutterFlowTheme.of(context).primaryText,
              size: 24.0,
            ),
            onPressed: () {
              // Add navigation logic or back functionality here
               context.go('/signInScreen');
            },
          ),
          title: Text('Forgot Password?',),
          
          actions: [],
          centerTitle: true,
          elevation: 0.0,
        ),
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SafeArea(
          top: true,
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 24.0, 24.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(32.0, 0.0, 32.0, 0.0),
                    child: Material(
                      color: Colors.transparent,
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(60.0),
                      ),
                      child: Container(
                        width: 120.0,
                        height: 120.0,
                        decoration: BoxDecoration(
                          color:
                              FlutterFlowTheme.of(context).secondaryBackground,
                          borderRadius: BorderRadius.circular(60.0),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(60.0),
                          child: Image.network(
                            'https://images.unsplash.com/photo-1580196923194-ddad5b516c88?w=500&h=500',
                            width: 120.0,
                            height: 120.0,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(32.0, 0.0, 32.0, 0.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          'Forgot Password?',
                          style: FlutterFlowTheme.of(context)
                              .headlineMedium
                              .override(
                                fontFamily: 'Inter Tight',
                                color: FlutterFlowTheme.of(context).primaryText,
                                letterSpacing: 0.0,
                              ),
                        ),
                        Text(
                          'No worries! Enter your email and we\'ll send you reset instructions.',
                          textAlign: TextAlign.center,
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                fontFamily: 'Inter',
                                color:
                                    FlutterFlowTheme.of(context).secondaryText,
                                letterSpacing: 0.0,
                              ),
                        ),
                      ].divide(SizedBox(height: 12.0)),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(32.0, 0.0, 32.0, 0.0),
                    child: Material(
                      color: Colors.transparent,
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      child: Container(
                        width: MediaQuery.sizeOf(context).width * 1.0,
                        decoration: BoxDecoration(
                          color:
                              FlutterFlowTheme.of(context).secondaryBackground,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 24.0, 24.0, 24.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              TextFormField(
                                controller: _model.textController,
                                focusNode: _model.textFieldFocusNode,
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
                                    borderSide: BorderSide(
                                      color: FlutterFlowTheme.of(context)
                                          .alternate,
                                      width: 1.0,
                                    ),
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: Color(0x00000000),
                                      width: 1.0,
                                    ),
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                  errorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: Color(0x00000000),
                                      width: 1.0,
                                    ),
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                  focusedErrorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: Color(0x00000000),
                                      width: 1.0,
                                    ),
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                  filled: true,
                                  fillColor: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                  suffixIcon: Icon(
                                    Icons.mail_outline,
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
                                validator: _model.textControllerValidator
                                    .asValidator(context),
                              ),
                              FFButtonWidget(
                                onPressed: () {
                                  print('Button pressed ...');
                                },
                                text: 'Reset Password',
                                options: FFButtonOptions(
                                  width: MediaQuery.sizeOf(context).width * 1.0,
                                  height: 50.0,
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 0.0),
                                  iconPadding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 0.0),
                                  color: FlutterFlowTheme.of(context).primary,
                                  textStyle: FlutterFlowTheme.of(context)
                                      .titleSmall
                                      .override(
                                        fontFamily: 'Inter Tight',
                                        color:
                                            FlutterFlowTheme.of(context).info,
                                        letterSpacing: 0.0,
                                      ),
                                  elevation: 0.0,
                                  borderRadius: BorderRadius.circular(25.0),
                                ),
                              ),
                            ].divide(SizedBox(height: 24.0)),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(32.0, 0.0, 32.0, 0.0),
                    child: Container(
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Remember your password? ',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  letterSpacing: 0.0,
                                ),
                          ),
                          Text(
                            'Sign In',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  color: FlutterFlowTheme.of(context).primary,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                        ].divide(SizedBox(width: 4.0)),
                      ),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(32.0, 0.0, 32.0, 0.0),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            16.0, 16.0, 16.0, 16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Icon(
                                  Icons.info_outline,
                                  color: FlutterFlowTheme.of(context).secondary,
                                  size: 24.0,
                                ),
                                Text(
                                  'Important:',
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Inter',
                                        color: FlutterFlowTheme.of(context)
                                            .primaryText,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                              ].divide(SizedBox(width: 12.0)),
                            ),
                            Text(
                              '• Check your spam folder if you don\'t see the email\n• The reset link will expire in 24 hours\n• Make sure to use your registered email address',
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          ].divide(SizedBox(height: 12.0)),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
