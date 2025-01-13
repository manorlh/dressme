import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Icon, Text, useTheme } from '@rneui/themed';
import { Camera, CameraType } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface CameraViewProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export const CameraView = ({ onCapture, onClose }: CameraViewProps) => {
  const { theme } = useTheme();
  const [type, setType] = useState(CameraType.back);
  const [permission, setPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  if (permission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (permission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.grey0, marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
          }}
        >
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        onCapture(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
      >
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Icon
                name="close"
                type="material-community"
                color="white"
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraType} style={styles.iconButton}>
              <Icon
                name="camera-flip"
                type="material-community"
                color="white"
                size={30}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.captureButton, { borderColor: theme.colors.primary }]}
              onPress={takePicture}
            >
              <View style={[styles.captureInner, { backgroundColor: theme.colors.primary }]} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
}); 