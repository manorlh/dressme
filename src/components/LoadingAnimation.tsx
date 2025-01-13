import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';

export const LoadingAnimation = () => {
  const { theme } = useTheme();
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon
          name="loading"
          type="material-community"
          size={50}
          color={theme.colors.primary}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 