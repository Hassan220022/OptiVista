import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/supabase/supabase_client.dart';

class AuthRepository {
  GoogleSignIn? _googleSignIn;

  /// Lazily initialize Google Sign-In only when needed
  GoogleSignIn _getGoogleSignIn() {
    if (_googleSignIn != null) return _googleSignIn!;

    final iosClientId = dotenv.env['GOOGLE_IOS_CLIENT_ID'];
    final webClientId = dotenv.env['GOOGLE_WEB_CLIENT_ID'];

    // Check if client IDs are configured
    if ((Platform.isIOS && (iosClientId == null || iosClientId.isEmpty)) ||
        (webClientId == null || webClientId.isEmpty)) {
      throw AuthException(
        'Google Sign-In not configured. Add GOOGLE_IOS_CLIENT_ID and GOOGLE_WEB_CLIENT_ID to .env',
      );
    }

    _googleSignIn = GoogleSignIn(
      clientId: Platform.isIOS ? iosClientId : null,
      serverClientId: webClientId,
      scopes: ['email', 'profile'],
    );

    return _googleSignIn!;
  }

  // ============ Email/Password Auth ============

  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return await supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUp({
    required String email,
    required String password,
    required String fullName,
  }) async {
    final response = await supabase.auth.signUp(
      email: email,
      password: password,
      data: {'full_name': fullName},
    );
    return response;
  }

  Future<void> signOut() async {
    // Sign out from Google if signed in
    if (_googleSignIn != null && await _googleSignIn!.isSignedIn()) {
      await _googleSignIn!.signOut();
    }
    await supabase.auth.signOut();
  }

  Future<void> resetPassword({required String email}) async {
    await supabase.auth.resetPasswordForEmail(email);
  }

  // ============ Native Google Sign-In ============

  Future<AuthResponse> signInWithGoogle() async {
    // Get or initialize Google Sign-In (throws if not configured)
    final googleSignIn = _getGoogleSignIn();
    
    // Trigger the native Google Sign-In flow
    final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
    
    if (googleUser == null) {
      throw AuthException('Google Sign-In was cancelled');
    }

    // Obtain the auth details from the request
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

    final idToken = googleAuth.idToken;
    final accessToken = googleAuth.accessToken;

    if (idToken == null) {
      throw AuthException('No ID token received from Google');
    }

    // Sign in to Supabase with the Google ID token
    final response = await supabase.auth.signInWithIdToken(
      provider: OAuthProvider.google,
      idToken: idToken,
      accessToken: accessToken,
    );

    return response;
  }

  // ============ Native Apple Sign-In ============

  /// Check if Apple Sign-In is available (iOS 13+ / macOS 10.15+)
  Future<bool> isAppleSignInAvailable() async {
    return await SignInWithApple.isAvailable();
  }

  Future<AuthResponse> signInWithApple() async {
    // Generate a random nonce for security
    final rawNonce = _generateNonce();
    final hashedNonce = sha256.convert(utf8.encode(rawNonce)).toString();

    // Request credentials from Apple
    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
      nonce: hashedNonce,
    );

    final idToken = credential.identityToken;
    if (idToken == null) {
      throw AuthException('No ID token received from Apple');
    }

    // Sign in to Supabase with Apple ID token
    final response = await supabase.auth.signInWithIdToken(
      provider: OAuthProvider.apple,
      idToken: idToken,
      nonce: rawNonce,
    );

    // Apple only provides name on first sign-in, so update profile if available
    if (credential.givenName != null || credential.familyName != null) {
      final fullName = [credential.givenName, credential.familyName]
          .where((n) => n != null && n.isNotEmpty)
          .join(' ');
      
      if (fullName.isNotEmpty) {
        await supabase.auth.updateUser(
          UserAttributes(data: {'full_name': fullName}),
        );
      }
    }

    return response;
  }

  /// Generate a random nonce string for Apple Sign-In security
  String _generateNonce([int length = 32]) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    final random = Random.secure();
    return List.generate(length, (_) => charset[random.nextInt(charset.length)]).join();
  }

  User? get currentUser => supabase.auth.currentUser;
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});
