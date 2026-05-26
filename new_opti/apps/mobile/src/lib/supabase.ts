import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Lazy-initialised Supabase client.
 *
 * If env vars are missing the client is still created but every call will
 * return a helpful error instead of crashing the whole app at import time.
 */
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[OptiVista] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Supabase calls will fail. Add them to your .env file.'
    );
  }

  _supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: Boolean(supabaseUrl && supabaseAnonKey),
      persistSession: Boolean(supabaseUrl && supabaseAnonKey),
      detectSessionInUrl: false,
    },
  });

  return _supabase;
}

/**
 * Proxy that forwards property access to the lazily-created client.
 * This lets consumers keep using `supabase.auth.getSession()` etc. unchanged.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

/** Check whether Supabase is properly configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
