import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, Modal, TouchableOpacity, Animated, Share, Platform } from 'react-native';
import { Button, Text, Card, useTheme, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from '../components/CameraView';
import { PhotoPreview } from '../components/PhotoPreview';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { BlurView } from 'expo-blur';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const INSTAGRAM_ASPECT_RATIO = 4 / 5; // Instagram portrait aspect ratio
const RESULT_IMAGE_WIDTH = width - 40; // Full width minus padding
const RESULT_IMAGE_HEIGHT = RESULT_IMAGE_WIDTH * INSTAGRAM_ASPECT_RATIO;

export const TryOnScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [activeImageSetter, setActiveImageSetter] = useState<(uri: string | null) => void | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const pickImage = async (setImage: (uri: string | null) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const startCamera = (setImage: (uri: string | null) => void) => {
    setActiveImageSetter(() => setImage);
    setShowCamera(true);
  };

  const handleCapture = (uri: string) => {
    setTempImage(uri);
    setShowCamera(false);
    setShowPreview(true);
  };

  const handleAcceptPhoto = () => {
    if (activeImageSetter && tempImage) {
      activeImageSetter(tempImage);
    }
    setShowPreview(false);
    setTempImage(null);
  };

  const handleRetakePhoto = () => {
    setShowPreview(false);
    setShowCamera(true);
  };

  const generateResult = async () => {
    if (!userImage || !clothingImage) return;
    
    setIsLoading(true);
    try {
      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll create a mock result by using the user's image
      setResultImage(userImage);
      setShowResult(true);
    } catch (error) {
      console.error('Error generating result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!resultImage) return;

    try {
      if (Platform.OS === 'ios') {
        await Share.share({
          url: resultImage,
          title: 'My Virtual Try-On',
        });
      } else {
        await Sharing.shareAsync(resultImage, {
          dialogTitle: 'Share your virtual try-on',
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(resultImage);
        // Show success feedback
        alert('Image saved to your photos!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save image');
    }
  };

  const themedStyles = {
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionButtonGradient: {
      width: '31%',
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: `${theme.colors.primary}20`,
    },
    imageCard: {
      width: '48%',
      padding: 12,
      marginHorizontal: 0,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
    },
    imagePickerButton: {
      width: '100%',
      height: width * 0.4,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: `${theme.colors.grey5}20`,
    },
  };

  const renderImagePicker = (
    title: string,
    image: string | null,
    setImage: (uri: string | null) => void,
    icon: string,
    iconType: string
  ) => (
    <Card containerStyle={[styles.imageCard, themedStyles.imageCard]}>
      <View style={styles.cardHeader}>
        <Icon
          name={icon}
          type={iconType}
          color={theme.colors.primary}
          size={24}
        />
        <Text style={[styles.cardTitle, { color: theme.colors.grey0 }]}>{title}</Text>
      </View>
      <TouchableOpacity
        style={[styles.imagePickerButton, themedStyles.imagePickerButton]}
        onPress={() => startCamera(setImage)}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContent}>
            <Icon
              name="camera"
              type="material-community"
              color={theme.colors.grey3}
              size={40}
            />
            <Text style={[styles.placeholderText, { color: theme.colors.grey2 }]}>
              Tap to take photo
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Button
        title="Choose from Gallery"
        type="outline"
        onPress={() => pickImage(setImage)}
        containerStyle={styles.buttonWrapper}
        buttonStyle={{ borderColor: theme.colors.primary }}
        titleStyle={{ color: theme.colors.primary }}
        icon={{
          name: 'image',
          type: 'material-community',
          color: theme.colors.primary,
          size: 20,
          style: { marginRight: 10 }
        }}
      />
    </Card>
  );

  const renderMagicButton = () => (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.magicButtonContainer}
    >
      <Button
        title="Generate Magic ✨"
        disabled={!userImage || !clothingImage || isLoading}
        onPress={generateResult}
        containerStyle={styles.magicButton}
        buttonStyle={{
          backgroundColor: 'transparent',
          paddingVertical: 15,
        }}
        disabledStyle={{
          backgroundColor: theme.colors.grey4,
        }}
        titleStyle={{
          fontSize: 18,
          fontWeight: '700',
        }}
        icon={{
          name: 'sparkles',
          type: 'material-community',
          color: 'white',
          size: 24,
          style: { marginRight: 10 }
        }}
      />
    </LinearGradient>
  );

  const renderResultActions = () => (
    <View style={styles.resultActions}>
      <View style={styles.actionButtonsRow}>
        <LinearGradient
          colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
          style={[styles.actionButtonGradient, themedStyles.actionButtonGradient]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <View style={styles.actionIconContainer}>
              <Icon
                name="share-variant"
                type="material-community"
                color={theme.colors.primary}
                size={28}
              />
            </View>
            <Text style={[styles.actionButtonText, { color: theme.colors.grey0 }]}>Share</Text>
            <Text style={[styles.actionButtonSubtext, { color: theme.colors.grey2 }]}>
              Share with friends
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
          style={[styles.actionButtonGradient, themedStyles.actionButtonGradient]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <View style={styles.actionIconContainer}>
              <Icon
                name="download"
                type="material-community"
                color={theme.colors.primary}
                size={28}
              />
            </View>
            <Text style={[styles.actionButtonText, { color: theme.colors.grey0 }]}>Save</Text>
            <Text style={[styles.actionButtonSubtext, { color: theme.colors.grey2 }]}>
              Save to gallery
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
          style={[styles.actionButtonGradient, themedStyles.actionButtonGradient]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setShowResult(false);
              navigation.navigate('WardrobeTab');
            }}
          >
            <View style={styles.actionIconContainer}>
              <Icon
                name="closet"
                type="material-community"
                color={theme.colors.primary}
                size={28}
              />
            </View>
            <Text style={[styles.actionButtonText, { color: theme.colors.grey0 }]}>Wardrobe</Text>
            <Text style={[styles.actionButtonSubtext, { color: theme.colors.grey2 }]}>
              Add to collection
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tryAgainButtonContainer}
      >
        <Button
          title="Create Another ✨"
          containerStyle={styles.tryAgainButton}
          buttonStyle={{
            backgroundColor: 'transparent',
            paddingVertical: 12,
          }}
          titleStyle={{
            fontSize: 16,
            fontWeight: '600',
          }}
          onPress={() => setShowResult(false)}
        />
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[`${theme.colors.primary}10`, theme.colors.background]}
        style={styles.gradient}
      >
        <Text h3 style={[styles.title, { color: theme.colors.grey0 }]}>Virtual Try-On</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageSection}>
            {renderImagePicker(
              'Your Photo',
              userImage,
              setUserImage,
              'account',
              'material-community'
            )}
            {renderImagePicker(
              'Clothing Item',
              clothingImage,
              setClothingImage,
              'tshirt',
              'font-awesome-5'
            )}
          </View>

          {renderMagicButton()}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <LoadingAnimation />
              <Text style={[styles.loadingText, { color: theme.colors.grey2 }]}>
                Creating your virtual try-on...
              </Text>
            </View>
          )}
        </ScrollView>

        <Modal visible={showCamera} animationType="slide">
          <CameraView
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        </Modal>

        <Modal visible={showPreview} animationType="slide">
          {tempImage && (
            <PhotoPreview
              uri={tempImage}
              onAccept={handleAcceptPhoto}
              onRetake={handleRetakePhoto}
            />
          )}
        </Modal>

        <Modal
          visible={showResult && !isLoading}
          transparent
          animationType="fade"
          onRequestClose={() => setShowResult(false)}
        >
          <View style={styles.resultModalContainer}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.resultModalContent, { backgroundColor: theme.colors.background }]}>
              <View style={styles.resultModalHeader}>
                <Text h4 style={{ color: theme.colors.grey0 }}>Your Virtual Try-On</Text>
                <TouchableOpacity onPress={() => setShowResult(false)}>
                  <Icon
                    name="close"
                    type="material-community"
                    color={theme.colors.grey0}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.resultImageContainer}>
                <Image 
                  source={{ uri: resultImage }} 
                  style={styles.resultImage}
                  resizeMode="contain"
                />
              </View>
              
              {renderResultActions()}
            </View>
          </View>
        </Modal>
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
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  imageCard: {
    width: '48%',
    padding: 12,
    marginHorizontal: 0,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePickerButton: {
    width: '100%',
    height: width * 0.4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 12,
  },
  magicButtonContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  magicButton: {
    width: '100%',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  resultModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultModalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  resultModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultImageContainer: {
    width: RESULT_IMAGE_WIDTH,
    height: RESULT_IMAGE_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultActions: {
    marginTop: 24,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButtonGradient: {
    width: '31%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButton: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  tryAgainButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tryAgainButton: {
    width: '100%',
  },
  actionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
}); 