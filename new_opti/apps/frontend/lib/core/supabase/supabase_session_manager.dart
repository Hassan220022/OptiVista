import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_client.dart';

final sessionProvider = StreamProvider<Session?>((ref) {
  return supabase.auth.onAuthStateChange.map((event) => event.session);
});

final userProvider = Provider<User?>((ref) {
  final session = ref.watch(sessionProvider).value;
  return session?.user;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(userProvider) != null;
});
