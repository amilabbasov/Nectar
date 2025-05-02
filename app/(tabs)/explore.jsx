import { ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { InteractionManager } from 'react-native';
import { debounce } from 'lodash';
import exploreData from '../data/exploreData';
import FilterModal from '../components/common/FilterModal';
import { SearchHeader, CategoryGrid, ProductList } from '../components/explore';
import { loadAllProducts, filterProducts, searchProducts, paginateProducts } from '../services/productService';
const { SafeAreaView } = require('../../components/common');

// Constants
const ITEMS_PER_PAGE = 10;

export default function ExploreScreen() {
  const router = useRouter();
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    selectedCategories: [],
    sortBy: 'none',
    selectedProductTypes: [],
    inStockOnly: false
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState([]);

  // Lazy load product categories
  useEffect(() => {
    setIsLoading(true);

    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        const initialCategories = [
          'organic',
          'fresh',
          'dairy',
        ];
        const initialProducts = loadAllProducts().filter(product =>
          initialCategories.includes(product.categoryType)
        );
        setAllProducts(initialProducts);
        setLoadedCategories(initialCategories);
        setIsLoading(false);
      }, 100);
    });

    return () => interactionPromise.cancel();
  }, []);

  const loadMoreCategories = () => {
    const remainingCategories = [
      'beverage',
      'bakery',
      'frozen',
      'meat',
      'cookingOilGhee',
      'riceAndGrains',
      'spicesAndSeasonings',
    ];

    const nextCategory = remainingCategories.find(
      category => !loadedCategories.includes(category)
    );

    if (nextCategory) {
      const newProducts = loadAllProducts().filter(
        product => product.categoryType === nextCategory
      );
      setAllProducts(prevProducts => [...prevProducts, ...newProducts]);
      setLoadedCategories(prevCategories => [...prevCategories, nextCategory]);
    }
  };

  const handleLoadMoreCategories = () => {
    loadMoreCategories();
  };

  // Memoize filtered and paginated data
  const filteredAndPaginatedProducts = useMemo(() => {
    if (allProducts.length === 0) return [];

    let results = [...allProducts];

    // Apply search if there's a query
    if (searchQuery) {
      results = searchProducts(results, searchQuery);
    }

    // Apply filters if active
    if (isFiltered) {
      results = filterProducts(results, filters);
    }

    // Apply pagination
    return paginateProducts(results, page, ITEMS_PER_PAGE);
  }, [allProducts, searchQuery, isFiltered, filters, page]);

  useEffect(() => {
    setDisplayProducts(filteredAndPaginatedProducts);
  }, [filteredAndPaginatedProducts]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((text) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  // Batch state updates
  const batchStateUpdates = (newFilters, newPage) => {
    setFilters(newFilters);
    setPage(newPage);

    const hasActiveFilters =
      newFilters.selectedCategories.length > 0 ||
      newFilters.selectedProductTypes.length > 0 ||
      newFilters.inStockOnly ||
      newFilters.sortBy !== 'none';

    setIsFiltered(hasActiveFilters);
  };

  // Handler functions
  const handleSearchChange = (text) => {
    debouncedSearch(text);
    batchStateUpdates(filters, 1); // Reset pagination when search changes
  };

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };

  const handleApplyFilter = (newFilters) => {
    batchStateUpdates(newFilters, 1); // Reset pagination when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      selectedCategories: [],
      sortBy: 'none',
      selectedProductTypes: [],
      inStockOnly: false
    });
    setIsFiltered(false);
  };

  const handleLoadMore = () => {
    if (displayProducts.length < allProducts.length) {
      setPage(prevPage => prevPage + 1);
    } else {
      handleLoadMoreCategories();
    }
  };

  const handleCategoryPress = (categoryName) => {
    const filteredProducts = allProducts.filter(
      (product) => product.categoryType === categoryName
    );

    router.push({
      pathname: '/category/categoryItems',
      params: { categoryName, products: JSON.stringify(filteredProducts) },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#181725" />
      </SafeAreaView>
    );
  }

  // Calculate whether we have more products to load
  const hasMoreProducts = searchQuery || isFiltered
    ? displayProducts.length < (searchQuery ? searchProducts(allProducts, searchQuery) : filterProducts(allProducts, filters)).length
    : displayProducts.length < allProducts.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Search Header */}
      <SearchHeader 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
        onFilterPress={handleFilterPress} 
      />

      {/* Main Content */}
      {searchQuery || isFiltered ? (
        <ProductList 
          products={displayProducts}
          searchQuery={searchQuery}
          isFiltered={isFiltered}
          onLoadMore={handleLoadMore}
          hasMoreProducts={hasMoreProducts}
        />
      ) : (
        <CategoryGrid 
          categories={exploreData} 
          onCategoryPress={handleCategoryPress} 
        />
      )}

      {/* Filter Modal - Lazy loaded */}
      {isFilterModalVisible && (
        <FilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApply={handleApplyFilter}
          onClear={handleClearFilters}
        />
      )}
    </SafeAreaView>
  );
}