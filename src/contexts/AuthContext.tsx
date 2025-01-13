import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, redirectUrl } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDeepLink = async (event: { url: string }) => {
    console.log('Handling deep link with URL:', event.url);
    try {
      const url = event.url;
      // Extract the code from the URL
      const code = url.split('code=')[1]?.split(/[#&]/)[0];
      console.log('Extracted code:', code ? '**present**' : '**missing**');

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Error exchanging code for session:', error.message);
          throw error;
        }
        
        console.log('Session set successfully:', {
          user: data.session?.user?.email,
          session_expires_at: data.session?.expires_at
        });
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } else {
        console.error('No code found in URL');
        throw new Error('No code found in URL');
      }
    } catch (error) {
      console.error('Error in handleDeepLink:', error);
      Alert.alert(
        'Authentication Error',
        'Failed to complete authentication. Please try again.'
      );
    }
  };

  useEffect(() => {
    // Check for active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Add deep link listener
    Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOAuthSignIn = async (provider: 'apple' | 'google') => {
    try {
      console.log(`Starting ${provider} sign in...`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data.url) {
        console.log('Opening auth session with URL:', data.url);
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
          {
            showInRecents: true,
            dismissButtonStyle: 'done',
            preferEphemeralSession: true
          }
        );

        console.log('Auth session result:', result);

        if (result.type === 'success') {
          console.log('Auth successful, processing callback...');
          await handleDeepLink({ url: result.url });
          // Close the browser window
          await WebBrowser.dismissBrowser();
        } else {
          console.log('Auth was cancelled or failed:', result.type);
          Alert.alert(
            'Authentication Cancelled',
            'The authentication process was cancelled or failed.'
          );
        }
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      Alert.alert(
        'Authentication Error',
        `Failed to sign in with ${provider}. Please try again.`
      );
    }
  };

  const signInWithApple = () => handleOAuthSignIn('apple');
  const signInWithGoogle = () => handleOAuthSignIn('google');

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(
        'Sign Out Error',
        'Failed to sign out. Please try again.'
      );
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithApple,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 