import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://muvriezouezjaclltmfw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dnJpZXpvdWV6amFjbGx0bWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTU3NTgsImV4cCI6MjA1MTU5MTc1OH0.StuNw5pRF7u6dYJc4BgFCy1JfapaCVYwzcNJASTvDsU';

export const redirectUrl = Linking.createURL('auth/callback');
console.log('OAuth redirect URL (save this for Supabase and Google console):', redirectUrl);

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Listen to auth events
const authStateListener = {
  onAuthStateChange: (event: AuthChangeEvent, session: Session | null) => {
    console.log('Supabase auth state changed:', event, 
      session ? {
        user: session.user?.email,
        expires_at: session.expires_at
      } : null
    );
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// Add the auth state listener
supabase.auth.onAuthStateChange(authStateListener.onAuthStateChange); 