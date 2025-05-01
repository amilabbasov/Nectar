import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TextInput, RefreshControl, InteractionManager, FlatList, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerCarousel } from '../../components/BannerCarousel';
import ExclusiveOfferSection from '../components/common/ExclusiveOfferSection';
import BestSellerSection from '../components/common/BestSellerSection';
import GroceriesSection from '../components/common/GroceriesSection';
import { groceryCategories } from '../data/groceryCategories';
import { StatusBar } from 'expo-status-bar';
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
import { useLocationContext } from '../../context/LocationContext';
import { debounce } from 'lodash';

const { width } = Dimensions.get('window');

// Memoize your section components
const MemoizedExclusiveOfferSection = React.memo(ExclusiveOfferSection);
const MemoizedBestSellerSection = React.memo(BestSellerSection);
const MemoizedGroceriesSection = React.memo(GroceriesSection);

const LazyMeatSection = React.lazy(() => import('../components/common/MeatSection'));

export default function ShopScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { getFormattedLocation, loading: locationLoading } = useLocationContext();
  const window = useWindowDimensions();

  const loadInitialProducts = useCallback(() => {
    // Just load the first categories initially
    const initialProducts = [
      ...organicProducts.map(product => ({ ...product, categoryType: 'organic' })),
      ...freshFruitsVegetables.map(product => ({ ...product, categoryType: 'fresh' })),
      ...dairyEggs.map(product => ({ ...product, categoryType: 'dairy' }))
    ];
    return initialProducts;
  }, []);

  const [allProducts, setAllProducts] = useState(() => loadInitialProducts());

  // When navigating to this screen
  useEffect(() => {
    const loadData = async () => {
      // Set a loading state here if needed
      
      InteractionManager.runAfterInteractions(() => {
        // Load initial products
        setAllProducts(loadInitialProducts());
      });
    };
    
    loadData();
  }, []);

  // Load remaining products after initial render
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const remainingProducts = [
        ...beverages.map(product => ({ ...product, categoryType: 'beverage' })),
        ...bakerySnacks.map(product => ({ ...product, categoryType: 'bakery' })),
        ...frozenFoods.map(product => ({ ...product, categoryType: 'frozen' })),
        ...meatFish.map(product => ({ ...product, categoryType: 'meat' })),
        ...cookingOilGhee.map(product => ({ ...product, categoryType: 'cookingOilGhee' })),
        ...riceAndGrains.map(product => ({ ...product, categoryType: 'riceAndGrains' })),
        ...spicesAndSeasonings.map(product => ({ ...product, categoryType: 'spicesAndSeasonings' }))
      ];
      setAllProducts(prev => [...prev, ...remainingProducts]);
    });
  }, []);

  const { searchQuery, setSearchQuery, filteredData, handleSearch } = useSearch(allProducts);

  // Create a debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((text, products) => {
      handleSearch(text, products);
    }, 300),
    [handleSearch]
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text, allProducts);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    InteractionManager.runAfterInteractions(() => {
      // Your refresh logic here
      setRefreshing(false);
    });
  }, []);

  // Get the formatted location
  const formattedLocation = getFormattedLocation();

  // Create sections data for FlatList
  const sections = useMemo(() => {
    return [
      { id: 'banner', type: 'banner' },
      { id: 'exclusive', type: 'exclusive' },
      { id: 'bestseller', type: 'bestseller' },
      { id: 'groceries', type: 'groceries' },
      { id: 'meat', type: 'meat' }
    ];
  }, []);

  // Render different section types
  const renderSection = useCallback(({ item }) => {
    switch (item.type) {
      case 'banner':
        return (
          <View style={styles.bannerContainer}>
            <BannerCarousel />
          </View>
        );
      case 'exclusive':
        return <MemoizedExclusiveOfferSection />;
      case 'bestseller':
        return <MemoizedBestSellerSection />;
      case 'groceries':
        return <MemoizedGroceriesSection categories={groceryCategories} />;
      case 'meat':
        return (
          <React.Suspense fallback={<View style={styles.placeholder} />}>
            <LazyMeatSection />
          </React.Suspense>
        );
      default:
        return null;
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Non-scrollable header content */}
      <View style={styles.headerContainer}>
        {/* Carrot Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/appItems/carrot-colorful.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        {/* Location Section with Icon */}
        <View style={styles.locationContainer}>
          <Image
            source={require('../assets/images/appItems/location.png')}
            style={styles.locationIcon}
            contentFit="contain"
          />
          <Text style={styles.locationText}>
            {locationLoading ? 'Loading...' : formattedLocation}
          </Text>
        </View>

        {/* Search Bar */}
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
        </View>
      </View>

      {searchQuery ? (
        <FlatList
          key="searchResultsGrid"
          data={filteredData}
          numColumns={2}
          keyExtractor={(item, index) => `${item.categoryType}-${item.id ?? index}`}
          renderItem={({ item }) => (
            <View style={styles.productCardWrapper}>
              <ProductCard
                id={item.id}
                name={item.name}
                pieces={item.weight || item.volume || item.quantity || ''}
                price={item.price}
                img={item.img}
                inStock={item.inStock}
                renderImage={(img) => (
                  <Image
                    source={img}
                    style={[styles.productImage, { width: window.width * 0.4 }]}
                    contentFit="contain"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                )}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <Text style={styles.resultsText}>
              {filteredData.length} results found for "{searchQuery}"
            </Text>
          )}
          windowSize={3}
          maxToRenderPerBatch={6}
          initialNumToRender={4}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#53B175']}
              tintColor="#53B175"
              title="Pull to refresh"
              titleColor="#7C7C7C"
            />
          }
          contentContainerStyle={styles.searchResultsContainer}
        />
      ) : (
        <FlatList
          key="sectionsGrid"
          data={sections}
          keyExtractor={item => item.id}
          renderItem={renderSection}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          windowSize={3}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#53B175']}
              tintColor="#53B175"
              title="Pull to refresh"
              titleColor="#7C7C7C"
            />
          }
          contentContainerStyle={styles.scroll}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 18,
    color: '#7C7C7C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 10,
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
  bannerContainer: {
    marginHorizontal: 16,
  },
  scroll: {
    paddingBottom: 20,
  },
  searchResultsContainer: {
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#7C7C7C',
    marginVertical: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  placeholder: {
    height: 200,
    backgroundColor: '#F2F3F2',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  productImage: {
    borderRadius: 8,
  },
});