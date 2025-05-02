import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProductCard from '../components/common/ProductCard';
import { freshFruitsVegetables } from '../data/productCategories/freshFruitsVegetables';
import { bestSellers } from '../data/bestSellers';
import { meatFish } from '../data/productCategories/meatFish';
import { bakerySnacks } from '../data/productCategories/bakerySnacks';
import { riceAndGrains } from '../data/productCategories/riceAndGrains';
import { spicesAndSeasonings } from '../data/productCategories/spicesAndSeasonings';
import { beverages } from '../data/productCategories/beverages';
import { cookingOilGhee } from '../data/productCategories/cookingOilGhee';
const { SafeAreaView } = require('../../components/common');

const ITEM_HEIGHT = 260;

export default function AllProductsScreen() {
  const { category, title } = useLocalSearchParams();
  const router = useRouter();
  
  const getProducts = () => {
    switch (category) {
      case 'exclusive':
        return freshFruitsVegetables;
      case 'bestSellers':
        return bestSellers;
      case 'meat':
        return meatFish;
      case 'bakery':
        return bakerySnacks.filter(item => item.category === 'bread' || 
          (item.category === 'specialty' && item.name.toLowerCase().includes('bread')));
      case 'riceAndGrains':
        return riceAndGrains.filter(item => item.category === 'rice');
      case 'spicesAndSeasonings':
        return spicesAndSeasonings;
      case 'tea':
        return beverages.filter(item => item.category === 'tea' || item.category === 'coffee');
      case 'oil':
        return cookingOilGhee;
      case 'pulses':
        return riceAndGrains.filter(item => item.category === 'lentils');
      default:
        return [];
    }
  };

  const products = getProducts();

  const handleBackToShop = () => {
    router.push('../');
  };

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * Math.floor(index / 2),
    index,
  }), []);

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackToShop}
          style={styles.backButton}
        >
          <Image 
            source={require('../assets/images/appItems/goBack.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'All Products'}</Text>
      </View>
      
      <FlatList
        data={products}
        numColumns={2}
        contentContainerStyle={[
          styles.productsGrid,
          Platform.OS === 'android' && { paddingBottom: 16 }
        ]}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({ item }) => (
          <View style={styles.productCardWrapper}>
            <ProductCard
              id={item.id}
              name={item.name}
              pieces={item.weight || item.volume || item.quantity || ''}
              price={item.price}
              img={item.img}
              inStock={item.inStock}
            />
          </View>
        )}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  productsGrid: {
    padding: 16,
  },
  productCardWrapper: {
    flex: 1,
    maxWidth: '50%',
    padding: 8,
  },
});