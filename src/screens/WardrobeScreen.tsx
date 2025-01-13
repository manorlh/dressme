import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Text, Card, useTheme, Icon, Image, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface TryOnItem {
  id: string;
  imageUrl: string;
  date: string;
  originalImage: string;
  clothingImage: string;
}

export const WardrobeScreen = () => {
  const { theme } = useTheme();
  const [selectedItem, setSelectedItem] = useState<TryOnItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // This would typically come from your storage or backend
  const savedTryOns: TryOnItem[] = [];

  const handleDeleteItem = (item: TryOnItem) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Here you would delete the item from storage
    setShowDeleteConfirm(false);
    setSelectedItem(null);
  };

  const renderItem = (item: TryOnItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setSelectedItem(item)}
      style={styles.cardContainer}
    >
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.background }]}>
        <Card.Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={[styles.cardDate, { color: theme.colors.grey1 }]}>
            {item.date}
          </Text>
          <TouchableOpacity
            onPress={() => handleDeleteItem(item)}
            style={styles.deleteButton}
          >
            <Icon
              name="trash-can-outline"
              type="material-community"
              color={theme.colors.error}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.secondary + '20', theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text h3 style={[styles.title, { color: theme.colors.grey0 }]}>My Wardrobe</Text>
          <Text style={[styles.subtitle, { color: theme.colors.grey2 }]}>
            Your Virtual Try-On Collection
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {savedTryOns.length > 0 ? (
            <View style={styles.gridContainer}>
              {savedTryOns.map(renderItem)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name="hanger"
                type="material-community"
                color={theme.colors.grey3}
                size={80}
              />
              <Text h4 style={[styles.emptyStateTitle, { color: theme.colors.grey1 }]}>
                Your Wardrobe is Empty
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme.colors.grey2 }]}>
                Start creating virtual try-ons to build your collection
              </Text>
            </View>
          )}
        </ScrollView>

        <Modal
          visible={!!selectedItem}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalContainer}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.grey0 }]}>
                  Try-On Details
                </Text>
                <TouchableOpacity onPress={() => setSelectedItem(null)}>
                  <Icon
                    name="close"
                    type="material-community"
                    color={theme.colors.grey0}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              {selectedItem && (
                <ScrollView>
                  <Image
                    source={{ uri: selectedItem.imageUrl }}
                    style={styles.modalImage}
                  />
                  <View style={styles.imageRow}>
                    <View style={styles.smallImageContainer}>
                      <Text style={[styles.imageLabel, { color: theme.colors.grey2 }]}>
                        Original Photo
                      </Text>
                      <Image
                        source={{ uri: selectedItem.originalImage }}
                        style={styles.smallImage}
                      />
                    </View>
                    <View style={styles.smallImageContainer}>
                      <Text style={[styles.imageLabel, { color: theme.colors.grey2 }]}>
                        Clothing Item
                      </Text>
                      <Image
                        source={{ uri: selectedItem.clothingImage }}
                        style={styles.smallImage}
                      />
                    </View>
                  </View>
                  <Text style={[styles.dateLabel, { color: theme.colors.grey2 }]}>
                    Created on {selectedItem.date}
                  </Text>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDeleteConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteConfirm(false)}
        >
          <View style={styles.modalContainer}>
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.confirmDialog, { backgroundColor: theme.colors.background }]}>
              <Icon
                name="alert"
                type="material-community"
                color={theme.colors.error}
                size={40}
              />
              <Text h4 style={[styles.confirmTitle, { color: theme.colors.grey0 }]}>
                Delete Try-On?
              </Text>
              <Text style={[styles.confirmText, { color: theme.colors.grey2 }]}>
                This action cannot be undone.
              </Text>
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  type="outline"
                  onPress={() => setShowDeleteConfirm(false)}
                  containerStyle={styles.buttonContainer}
                  buttonStyle={{ borderColor: theme.colors.grey3 }}
                  titleStyle={{ color: theme.colors.grey3 }}
                />
                <Button
                  title="Delete"
                  onPress={confirmDelete}
                  containerStyle={styles.buttonContainer}
                  buttonStyle={{ backgroundColor: theme.colors.error }}
                />
              </View>
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
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 12,
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: width / 2 - 18,
    marginBottom: 12,
  },
  card: {
    margin: 0,
    padding: 8,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalImage: {
    width: '100%',
    height: width * 1.2,
    borderRadius: 16,
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallImageContainer: {
    width: '48%',
  },
  imageLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  smallImage: {
    width: '100%',
    height: width * 0.4,
    borderRadius: 12,
  },
  dateLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  confirmDialog: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  confirmText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 