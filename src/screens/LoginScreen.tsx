import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const LoginScreen = () => {
  const { theme } = useTheme();
  const { signInWithApple, signInWithGoogle } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[`${theme.colors.primary}20`, theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.header}
          >
            <Text h1 style={[styles.title, { color: theme.colors.grey0 }]}>Welcome to DressMe</Text>
            <Text style={[styles.subtitle, { color: theme.colors.grey2 }]}>
              Sign in to start your virtual fashion journey
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.buttonContainer}
          >
            {Platform.OS === 'ios' && (
              <Button
                title="Sign in with Apple"
                onPress={signInWithApple}
                icon={{
                  name: 'apple',
                  type: 'font-awesome',
                  size: 24,
                  color: theme.colors.grey0,
                }}
                buttonStyle={[
                  styles.signInButton,
                  { backgroundColor: theme.colors.grey0 }
                ]}
                titleStyle={[
                  styles.signInButtonText,
                  { color: theme.colors.background }
                ]}
                containerStyle={styles.buttonWrapper}
              />
            )}

            <Button
              title="Sign in with Google"
              onPress={signInWithGoogle}
              icon={{
                name: 'google',
                type: 'font-awesome',
                size: 24,
                color: theme.colors.grey0,
              }}
              buttonStyle={[
                styles.signInButton,
                { backgroundColor: theme.colors.error }
              ]}
              titleStyle={styles.signInButtonText}
              containerStyle={styles.buttonWrapper}
            />
          </Animated.View>

          <Animated.Text 
            entering={FadeInDown.delay(600)}
            style={[styles.terms, { color: theme.colors.grey3 }]}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Animated.Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  signInButton: {
    height: 56,
    borderRadius: 16,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  terms: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
}); 