import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import exploreData from '../data/exploreData';
import { useRouter } from 'expo-router';
import { useSearch } from '../hooks/useSearch';
import { organicProducts } from '../data/productCategories/organicProducts';
import { freshFruitsVegetables } from '../data/productCategories/freshFruitsVegetables';
import { dairyEggs } from '../data/productCategories/dairyEggs';
import { beverages } from '../data/productCategories/beverages';
import { bakerySnacks } from '../data/productCategories/bakerySnacks';
import { frozenFoods } from '../data/productCategories/frozenFoods';
import { meatFish } from '../data/productCategories/meatFish';
import { cookingOilGhee } from '../data/productCategories/cookingOilGhee';
import { riceAndGrains } from '../data/productCategories/riceAndGrains';
import { spicesAndSeasonings } from '../data/productCategories/spicesAndSeasonings';
import ProductCard from '../components/common/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../components/common/FilterModal';
import { InteractionManager } from 'react-native';

const ITEM_HEIGHT = 260; // Approximate height of each product card including margins

export default function ExploreScreen() {
  const router = useRouter();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    selectedCategories: [],
    sortBy: 'none',
    selectedProductTypes: [],
    inStockOnly: false
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setIsLoading(false);
    });

    return () => interactionPromise.cancel();
  }, []);

  const allProducts = useMemo(() => [
    ...organicProducts.map(product => ({ ...product, categoryType: 'organic' })),
    ...freshFruitsVegetables.map(product => ({ ...product, categoryType: 'fresh' })),
    ...dairyEggs.map(product => ({ ...product, categoryType: 'dairy' })),
    ...beverages.map(product => ({ ...product, categoryType: 'beverage' })),
    ...bakerySnacks.map(product => ({ ...product, categoryType: 'bakery' })),
    ...frozenFoods.map(product => ({ ...product, categoryType: 'frozen' })),
    ...meatFish.map(product => ({ ...product, categoryType: 'meat' })),
    ...cookingOilGhee.map(product => ({ ...product, categoryType: 'cookingOilGhee' })),
    ...riceAndGrains.map(product => ({ ...product, categoryType: 'riceAndGrains' })),
    ...spicesAndSeasonings.map(product => ({ ...product, categoryType: 'spicesAndSeasonings' }))
  ], []);

  const { searchQuery, setSearchQuery, filteredData, setFilteredData, handleSearch } = useSearch(allProducts);

  const handleCategoryPress = (categoryName) => {
    const filteredProducts = allProducts.filter(
      (product) => product.categoryType === categoryName
    );

    router.push({
      pathname: '/category/categoryItems',
      params: { categoryName, products: JSON.stringify(filteredProducts) },
    });
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    handleSearch(text, allProducts);
  };

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);

    const hasActiveFilters =
      newFilters.selectedCategories.length > 0 ||
      newFilters.selectedProductTypes.length > 0 ||
      newFilters.inStockOnly ||
      newFilters.sortBy !== 'none';

    setIsFiltered(hasActiveFilters);

    let filtered = [...allProducts];

    // Apply category filter
    if (newFilters.selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        newFilters.selectedCategories.includes(product.categoryType)
      );
    }

    // Apply product type filter
    if (newFilters.selectedProductTypes.length > 0) {
      filtered = filtered.filter(product => {
        if (newFilters.selectedProductTypes.includes('weight') && product.weight) return true;
        if (newFilters.selectedProductTypes.includes('volume') && product.volume) return true;
        if (newFilters.selectedProductTypes.includes('piece') && product.pieces) return true;
        return false;
      });
    }

    if (newFilters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    if (newFilters.sortBy !== 'none') {
      filtered.sort((a, b) => {
        switch (newFilters.sortBy) {
          case 'priceLowHigh':
            return a.price - b.price;
          case 'priceHighLow':
            return b.price - a.price;
          case 'nameAZ':
            return a.name.localeCompare(b.name);
          case 'nameZA':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      selectedCategories: [],
      sortBy: 'none',
      selectedProductTypes: [],
      inStockOnly: false
    });
    setIsFiltered(false);
    setFilteredData(allProducts);
  };

  const displayData = useMemo(() => {
    if (searchQuery || isFiltered) return filteredData;
    return allProducts;
  }, [searchQuery, isFiltered, filteredData, allProducts]);

  const renderProductItem = useCallback(({ item, index }) => (
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
  ), []);

  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
          borderWidth: 1,
        }
      ]}
      onPress={() => handleCategoryPress(item.name)}
    >
      <Image
        source={item.img}
        style={styles.categoryImage}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  ), []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * Math.floor(index / 2),
    index,
  }), []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#181725" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header with Search */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Products</Text>
        <View style={styles.searchContainer}>
          <Image
            source={require('../assets/images/appItems/search.png')}
            style={styles.searchIcon}
            contentFit="contain"
          />
          <TextInput
            placeholder="Search Store"
            style={styles.searchInput}
            placeholderTextColor="#7C7C7C"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#181725" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Display content based on search/filter state */}
      {searchQuery || isFiltered ? (
        // Show search/filter results with FlatList
        <View style={styles.searchResultsContainer}>
          <Text style={styles.resultsText}>
            {displayData.length} results found
            {searchQuery ? ` for "${searchQuery}"` : ''}
            {isFiltered ? ' with applied filters' : ''}
          </Text>
          <FlatList
            key="resultsGrid"
            data={displayData}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => `${item.categoryType}-${index}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsGridContainer}
            columnWrapperStyle={styles.productsRow}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={7}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
            getItemLayout={getItemLayout}
          />
        </View>
      ) : (
        // Show categories with FlatList
        <FlatList
          key="categoriesGrid"
          data={exploreData}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          columnWrapperStyle={styles.categoryRow}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilter}
        onClear={handleClearFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    paddingLeft: 10,
  },
  filterButton: {
    padding: 8,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#7C7C7C',
    marginVertical: 16,
  },
  productsGridContainer: {
    paddingBottom: 16,
  },
  productsRow: {
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 200,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
});