import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button, Text, useTheme, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const scaleAnim = new Animated.Value(0.95);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text h1 style={[styles.title, { color: theme.colors.grey0 }]}>DressMe</Text>
          <Text style={[styles.subtitle, { color: theme.colors.grey2 }]}>
            Experience the Future of Fashion
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Animated.View 
            style={[
              styles.imageWrapper,
              { 
                backgroundColor: theme.colors.grey5 + '50',
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <Icon
              name="tshirt"
              type="font-awesome-5"
              size={width * 0.25}
              color={theme.colors.primary}
            />
          </Animated.View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Start Virtual Try-On"
            icon={{
              name: 'tshirt',
              type: 'font-awesome-5',
              color: 'white',
              size: 20,
              style: { marginRight: 10 }
            }}
            containerStyle={styles.buttonWrapper}
            buttonStyle={{ backgroundColor: theme.colors.primary }}
            onPress={() => navigation.navigate('TryOnTab')}
          />
          
          <Button
            title="View My Wardrobe"
            icon={{
              name: 'closet',
              type: 'material-community',
              color: theme.colors.primary,
              size: 20,
              style: { marginRight: 10 }
            }}
            type="outline"
            containerStyle={styles.buttonWrapper}
            buttonStyle={{ borderColor: theme.colors.primary }}
            onPress={() => navigation.navigate('WardrobeTab')}
          />
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  imageWrapper: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  buttonWrapper: {
    marginVertical: 8,
  },
}); 