import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { favoriteItems, removeFromFavorites } = useFavorites();
  const router = useRouter();

  const handleRemoveFavorite = (itemId) => {
    removeFromFavorites(itemId);
  };

  const handleProductPress = (itemId) => {
    router.push(`/product/${itemId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Favorites</Text>
      <ScrollView style={styles.scrollView}>
        {favoriteItems.length === 0 ? (
          <Text style={styles.emptyFavorites}>Your favorites list is empty</Text>
        ) : (
          favoriteItems.map((item, index) => (
            <TouchableOpacity 
              key={`favorite-item-${item.id || index}`} 
              style={styles.favoriteItem}
              onPress={() => handleProductPress(item.id)}
            >
              <Image source={item.img} style={styles.productImage} resizeMode="contain" />
              <View style={styles.itemDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productWeight}>
                  {item.weight || item.volume || item.quantity || item.pieces || ''}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(item.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181725',
  },
  productWeight: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#7C7C7C',
  },
  emptyFavorites: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 32,
  },
});