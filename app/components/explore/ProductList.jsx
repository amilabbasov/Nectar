import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ProductCard from '../common/ProductCard';

const ITEM_HEIGHT = 260; // Approximate height of each product card including margins

const ProductList = ({ 
  products, 
  searchQuery = '', 
  isFiltered = false, 
  onLoadMore, 
  hasMoreProducts = false 
}) => {
  const renderProductItem = useCallback(({ item }) => (
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

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const renderFooter = () => {
    if (!hasMoreProducts) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#53B175" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsText}>
        {products.length} results found
        {searchQuery ? ` for "${searchQuery}"` : ''}
        {isFiltered ? ' with applied filters' : ''}
      </Text>
      
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => `${item.categoryType}-${index}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsGridContainer}
        columnWrapperStyle={styles.productsRow}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={getItemLayout}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ProductList;