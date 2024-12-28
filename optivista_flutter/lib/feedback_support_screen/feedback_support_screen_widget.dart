import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'feedback_support_screen_model.dart';
export 'feedback_support_screen_model.dart';

class FeedbackSupportScreenWidget extends StatefulWidget {
  /// ### ✨ **Feedback/Support Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **Feedback/Support Screen** enables users to report issues, provide
  /// feedback, or seek assistance. It is designed to foster communication
  /// between users and the support team, ensuring a positive user experience.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **Ease of Communication**:
  ///    Make it simple for users to share their concerns or feedback.
  ///
  /// 2. **Categorization**:
  ///    Allow users to specify the type of support they need for quicker
  /// resolution.
  ///
  /// 3. **Responsiveness**:
  ///    Provide users with reassurance that their submissions will be
  /// addressed.
  ///
  /// 4. **Engagement**:
  ///    Encourage feedback to improve the app by emphasizing its value to the
  /// team.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Professional and
  /// trustworthy.
  /// - **Accent Color**: Bright Green `#28A745` – Highlights actionable buttons
  /// like "Submit."
  /// - **Background**: White `#FFFFFF` – Clean and neutral.
  /// - **Text Color**: Charcoal `#333333` – Readable and neutral.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **Header**
  ///    Displays the screen title and a brief description.
  ///
  /// 2. **Feedback/Support Type Selector**
  ///    Dropdown or buttons for selecting the nature of the submission (e.g.,
  /// Bug Report, Feature Request, General Feedback).
  ///
  /// 3. **Message Input Field**
  ///    Text area for users to describe their issue or feedback.
  ///
  /// 4. **Attachment Option**
  ///    Allows users to attach screenshots or files for better context.
  ///
  /// 5. **Contact Information**
  ///    Optional field to enter an email for follow-up communication.
  ///
  /// 6. **Submit Button**
  ///    Sends the feedback or support request to the team.
  ///
  /// 7. **Confirmation Message (Post-Submission)**
  ///    Displays a thank-you message and assurance of a follow-up.
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
  /// | **Screen Title**       | Displays "Feedback & Support" prominently at
  /// the top.|
  /// | **Subtitle**           | Text: "We’d love to hear from you! Share
  /// feedback or report issues below."|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Feedback & Support                                         |
  /// | We’d love to hear from you! Share feedback or report issues.|
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Feedback/Support Type Selector**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Dropdown/Button Group**| Options: Bug Report, Feature Request, General
  /// Feedback.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Select Support Type ▼]                                    |
  /// | Options: Bug Report, Feature Request, General Feedback.    |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. Message Input Field**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Text Area**          | Placeholder: "Describe your feedback or issue
  /// here."|
  /// | **Character Counter**  | Displays remaining characters to guide user
  /// input.  |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Describe your feedback or issue here...]                  |
  /// | [Character Counter: 250/500]                               |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Attachment Option**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Upload Button**      | Text: "Attach a screenshot or file."
  ///     |
  /// | **File Preview**       | Shows uploaded files with an option to remove
  /// them.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Attach a screenshot or file]                             |
  /// | [File: Screenshot.png X]                                   |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **5. Contact Information**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Email Field**        | Placeholder: "Enter your email for follow-up
  /// (optional)."|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Enter your email for follow-up (optional)]                |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **6. Submit Button**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Button Text**        | "Submit"
  ///     |
  /// | **Action**             | Sends the feedback or support request.
  ///     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Submit Button]                                            |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **7. Confirmation Message (Post-Submission)**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Message Text**       | Example: "Thank you for your feedback! We’ll
  /// get back to you soon."|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Thank you for your feedback! We’ll get back to you soon.   |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **Choose Support Type**:
  ///    - Select the type of issue or feedback from the dropdown.
  ///
  /// 2. **Describe the Issue**:
  ///    - Enter details in the message text area.
  ///
  /// 3. **Attach Files (Optional)**:
  ///    - Add screenshots or files for additional context.
  ///
  /// 4. **Enter Contact Information (Optional)**:
  ///    - Provide an email address for follow-up communication.
  ///
  /// 5. **Submit Request**:
  ///    - Tap "Submit" to send the message to the support team.
  ///
  /// 6. **Receive Confirmation**:
  ///    - View a confirmation message indicating successful submission.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Dropdown Animation**:
  ///    - Smooth dropdown expansion for selecting support type.
  ///
  /// 2. **Attachment Upload Feedback**:
  ///    - Files fade in with a progress indicator during upload.
  ///
  /// 3. **Submit Button Feedback**:
  ///    - Button pulses slightly on tap with a loading spinner before
  /// submission.
  ///
  /// 4. **Confirmation Message Fade-In**:
  ///    - Success message appears with a fade-in effect.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **File Attachments**:
  ///    - Users can add screenshots or files to provide additional context.
  ///
  /// 2. **Follow-Up Option**:
  ///    - Optional email field ensures users can receive responses without
  /// mandatory input.
  ///
  /// 3. **Support Categorization**:
  ///    - Sorting feedback by type streamlines issue resolution for the support
  /// team.
  ///
  /// 4. **User-Friendly Design**:
  ///    - Character counters and placeholders guide users to provide clear,
  /// concise input.
  const FeedbackSupportScreenWidget({super.key});

  @override
  State<FeedbackSupportScreenWidget> createState() =>
      _FeedbackSupportScreenWidgetState();
}

class _FeedbackSupportScreenWidgetState
    extends State<FeedbackSupportScreenWidget> {
  late FeedbackSupportScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => FeedbackSupportScreenModel());

    _model.textController1 ??= TextEditingController();
    _model.textFieldFocusNode1 ??= FocusNode();

    _model.textController2 ??= TextEditingController();
    _model.textFieldFocusNode2 ??= FocusNode();
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
        appBar: AppBar(
          backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
          automaticallyImplyLeading: false,
          leading: FlutterFlowIconButton(
            buttonSize: 48.0,
            icon: Icon(
              Icons.arrow_back,
              color: FlutterFlowTheme.of(context).primaryText,
              size: 24.0,
            ),
            onPressed: () {
               context.go('/homeScreen');
            },
          ),
          title: Text(
            'Feedback & Support',
            style: FlutterFlowTheme.of(context).headlineMedium.override(
                  fontFamily: 'Inter Tight',
                  letterSpacing: 0.0,
                ),
          ),
          actions: [],
          centerTitle: false,
          elevation: 0.0,
        ),
        body: SafeArea(
          top: true,
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 24.0, 0.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Text(
                    'We\'d love to hear from you! Share feedback or report issues below.',
                    style: FlutterFlowTheme.of(context).bodyLarge.override(
                          fontFamily: 'Inter',
                          color: FlutterFlowTheme.of(context).secondaryText,
                          letterSpacing: 0.0,
                        ),
                  ),
                  Material(
                    color: Colors.transparent,
                    elevation: 2.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            20.0, 20.0, 20.0, 20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Text(
                              'Support Type',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            Container(
                              width: MediaQuery.sizeOf(context).width * 1.0,
                              decoration: BoxDecoration(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                borderRadius: BorderRadius.circular(8.0),
                                border: Border.all(
                                  color: FlutterFlowTheme.of(context).alternate,
                                  width: 1.0,
                                ),
                              ),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    12.0, 16.0, 12.0, 16.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Select Support Type',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                    Icon(
                                      Icons.keyboard_arrow_down,
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryText,
                                      size: 24.0,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ].divide(SizedBox(height: 16.0)),
                        ),
                      ),
                    ),
                  ),
                  Material(
                    color: Colors.transparent,
                    elevation: 2.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            20.0, 20.0, 20.0, 20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Text(
                              'Message',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            TextFormField(
                              controller: _model.textController1,
                              focusNode: _model.textFieldFocusNode1,
                              autofocus: false,
                              obscureText: false,
                              decoration: InputDecoration(
                                hintText:
                                    'Describe your feedback or issue here...',
                                hintStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      letterSpacing: 0.0,
                                    ),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                    color:
                                        FlutterFlowTheme.of(context).alternate,
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
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    letterSpacing: 0.0,
                                  ),
                              maxLines: 8,
                              minLines: 5,
                              validator: _model.textController1Validator
                                  .asValidator(context),
                            ),
                          ].divide(SizedBox(height: 16.0)),
                        ),
                      ),
                    ),
                  ),
                  Material(
                    color: Colors.transparent,
                    elevation: 2.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            20.0, 20.0, 20.0, 20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Text(
                              'Attachments',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            Container(
                              width: MediaQuery.sizeOf(context).width * 1.0,
                              height: 100.0,
                              decoration: BoxDecoration(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                borderRadius: BorderRadius.circular(8.0),
                                border: Border.all(
                                  color: FlutterFlowTheme.of(context).alternate,
                                  width: 1.0,
                                ),
                              ),
                              child: Padding(
                                padding: EdgeInsets.all(16.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.cloud_upload,
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      size: 32.0,
                                    ),
                                    Text(
                                      'Tap to upload screenshots',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ].divide(SizedBox(height: 16.0)),
                        ),
                      ),
                    ),
                  ),
                  Material(
                    color: Colors.transparent,
                    elevation: 2.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            20.0, 20.0, 20.0, 20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Text(
                              'Contact Information',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            TextFormField(
                              controller: _model.textController2,
                              focusNode: _model.textFieldFocusNode2,
                              autofocus: false,
                              obscureText: false,
                              decoration: InputDecoration(
                                hintText:
                                    'Enter your email for follow-up (optional)',
                                hintStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      letterSpacing: 0.0,
                                    ),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                    color:
                                        FlutterFlowTheme.of(context).alternate,
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
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    letterSpacing: 0.0,
                                  ),
                              minLines: 1,
                              keyboardType: TextInputType.emailAddress,
                              validator: _model.textController2Validator
                                  .asValidator(context),
                            ),
                          ].divide(SizedBox(height: 16.0)),
                        ),
                      ),
                    ),
                  ),
                  FFButtonWidget(
                    onPressed: () {
                      print('Button pressed ...');
                    },
                    text: 'Submit Feedback',
                    options: FFButtonOptions(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      height: 56.0,
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                      iconPadding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                      color: FlutterFlowTheme.of(context).primary,
                      textStyle:
                          FlutterFlowTheme.of(context).titleMedium.override(
                                fontFamily: 'Inter Tight',
                                color: FlutterFlowTheme.of(context).info,
                                letterSpacing: 0.0,
                              ),
                      elevation: 3.0,
                      borderRadius: BorderRadius.circular(28.0),
                    ),
                  ),
                ].divide(SizedBox(height: 24.0)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
