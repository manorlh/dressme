import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Icon, Text, useTheme } from '@rneui/themed';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface PhotoPreviewProps {
  uri: string;
  onAccept: () => void;
  onRetake: () => void;
}

export const PhotoPreview = ({ uri, onAccept, onRetake }: PhotoPreviewProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <BlurView intensity={100} tint="dark" style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          onPress={onRetake}
        >
          <Icon name="camera-retake" type="material-community" color="white" size={24} />
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.success }]}
          onPress={onAccept}
        >
          <Icon name="check" type="material-community" color="white" size={24} />
          <Text style={styles.buttonText}>Use Photo</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'contain',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
}); 