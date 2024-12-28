import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'sign_in_screen_model.dart';
export 'sign_in_screen_model.dart';

class SignInScreenWidget extends StatefulWidget {
  const SignInScreenWidget({super.key});

  @override
  State<SignInScreenWidget> createState() => _SignInScreenWidgetState();
}

class _SignInScreenWidgetState extends State<SignInScreenWidget> {
  late SignInScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SignInScreenModel());

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
        body: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Container(
                  width: MediaQuery.sizeOf(context).width,
                  height: MediaQuery.sizeOf(context).height,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF1A1A40), Color(0xFF2A2A60)],
                      stops: [0.0, 1.0],
                      begin: AlignmentDirectional(0.0, -1.0),
                      end: AlignmentDirectional(0.0, 1.0),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsetsDirectional.all(24.0),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // Image.network(
                          //   'https://images.unsplash.com/photo-1726091985334-25a6fac7803c?w=500&h=500',
                          //   width: double.infinity,
                          //   height: 120.0,
                          //   fit: BoxFit.fill,
                          // ),
                            
                          const SizedBox(height: 100.0),
                          Text(
                            'Welcome Back',
                            style: FlutterFlowTheme.of(context).displaySmall.override(
                                  fontFamily: 'Inter Tight',
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          Text(
                            'Sign in to continue shopping',
                            style: FlutterFlowTheme.of(context).bodyLarge.override(
                                  fontFamily: 'Inter',
                                  color: Color(0xFFE0E0E0),
                                ),
                          ),
                          const SizedBox(height: 24.0),
                          Material(
                            color: Colors.transparent,
                            elevation: 4.0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            child: Container(
                              padding: const EdgeInsets.all(24.0),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16.0),
                              ),
                              child: Column(
                                children: [
                                  TextFormField(
                                    controller: _model.textController1,
                                    focusNode: _model.textFieldFocusNode1,
                                    decoration: InputDecoration(
                                      labelText: 'Email Address',
                                      filled: true,
                                      fillColor: FlutterFlowTheme.of(context)
                                          .secondaryBackground,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(8.0),
                                      ),
                                      suffixIcon: const Icon(Icons.mail_outline),
                                    ),
                                    keyboardType: TextInputType.emailAddress,
                                  ),
                                  const SizedBox(height: 16.0),
                                  TextFormField(
                                    controller: _model.textController2,
                                    focusNode: _model.textFieldFocusNode2,
                                    obscureText: !_model.passwordVisibility,
                                    decoration: InputDecoration(
                                      labelText: 'Password',
                                      filled: true,
                                      fillColor: FlutterFlowTheme.of(context)
                                          .secondaryBackground,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(8.0),
                                      ),
                                      suffixIcon: IconButton(
                                        icon: Icon(
                                          _model.passwordVisibility
                                              ? Icons.visibility
                                              : Icons.visibility_off,
                                        ),
                                        onPressed: () => setState(() {
                                          _model.passwordVisibility =
                                              !_model.passwordVisibility;
                                        }),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8.0),
                                  Align(
                                    alignment: Alignment.centerRight,
                                    child: InkWell(
                                      onTap: () {
                                         context.go('/forgetPasswordScreen');
                                      },
                                      child: Text(
                                        'Forgot Password?',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              color: FlutterFlowTheme.of(context)
                                                  .primary,
                                            ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 24.0),
                                  FFButtonWidget(
                                    onPressed: () {
                                      context.go('/profileScreen');
                                    },
                                    text: 'Sign In',
                                    options: FFButtonOptions(
                                      width: double.infinity,
                                      height: 56.0,
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      textStyle: FlutterFlowTheme.of(context)
                                          .titleMedium
                                          .override(
                                            fontFamily: 'Inter Tight',
                                            color: Colors.white,
                                          ),
                                      borderRadius: BorderRadius.circular(28.0),
                                    ),
                                  ),
                                  const SizedBox(height: 24.0),
                                  Text(
                                    'or continue with',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryText,
                                        ),
                                  ),
                                  const SizedBox(height: 16.0),
                                  Container(
                                    width: double.infinity,
                                    height: 56.0,
                                    decoration: BoxDecoration(
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryBackground,
                                      borderRadius: BorderRadius.circular(28.0),
                                      border: Border.all(
                                        color: const Color(0xFFE0E0E0),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Image.network(
                                          'https://images.unsplash.com/photo-1662947203440-573db428a7ab?w=500&h=500',
                                          width: 24.0,
                                          height: 24.0,
                                          fit: BoxFit.contain,
                                        ),
                                        const SizedBox(width: 12.0),
                                        Text(
                                          'Sign in with Google',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyLarge,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 24.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Don\'t have an account?',
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      color: const Color(0xFFE0E0E0),
                                    ),
                              ),
                              const SizedBox(width: 4.0),
                              InkWell(
                                onTap: () {
                                  context.go('/signUpScreen');
                                },
                                child: Text(
                                  'Sign Up',
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Inter',
                                        color: const Color(0xFFFFC857),
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
