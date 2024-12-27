import '../flutter_flow/flutter_flow_util.dart';
import 'forget_password_screen_widget.dart' show ForgetPasswordScreenWidget;
import 'package:flutter/material.dart';

class ForgetPasswordScreenModel
    extends FlutterFlowModel<ForgetPasswordScreenWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? Function(BuildContext, String?)? textControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    textFieldFocusNode?.dispose();
    textController?.dispose();
  }
}
