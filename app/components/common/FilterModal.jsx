import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Animated, Platform, TouchableWithoutFeedback, FlatList, PanResponder } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Move these outside the component to prevent recreation on each render
const CATEGORIES = [
  { id: 'organic', label: 'Organic' },
  { id: 'fresh', label: 'Fresh Fruits & Vegetables' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'beverage', label: 'Beverages' },
  { id: 'bakery', label: 'Bakery & Snacks' },
  { id: 'frozen', label: 'Frozen Foods' },
  { id: 'meat', label: 'Meat & Fish' },
  { id: 'cookingOilGhee', label: 'Cooking Oil & Ghee' },
  { id: 'riceAndGrains', label: 'Rice & Grains' },
  { id: 'spicesAndSeasonings', label: 'Spices & Seasonings' }
];

const SORT_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'priceLowHigh', label: 'Price: Low to High' },
  { id: 'priceHighLow', label: 'Price: High to Low' },
  { id: 'nameAZ', label: 'Name: A to Z' },
  { id: 'nameZA', label: 'Name: Z to A' }
];

const PRODUCT_TYPES = [
  { id: 'weight', label: 'Weight-based' },
  { id: 'volume', label: 'Volume-based' },
  { id: 'piece', label: 'Piece-based' }
];

const { height } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onApply, onClear }) => {
  const [filters, setFilters] = useState({
    selectedCategories: [],
    sortBy: 'none',
    selectedProductTypes: [],
    inStockOnly: false
  });

  const translateY = useRef(new Animated.Value(height)).current;

  // Use useCallback for handlers to prevent recreating functions on each render
  const handleCategoryToggle = useCallback((categoryId) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  }, []);

  const handleProductTypeToggle = useCallback((typeId) => {
    setFilters(prev => ({
      ...prev,
      selectedProductTypes: prev.selectedProductTypes.includes(typeId)
        ? prev.selectedProductTypes.filter(id => id !== typeId)
        : [...prev.selectedProductTypes, typeId]
    }));
  }, []);

  const handleSortChange = useCallback((sortOption) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortOption
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      selectedCategories: [],
      sortBy: 'none',
      selectedProductTypes: [],
      inStockOnly: false
    });
    onClear();
  }, [onClear]);

  const handleApply = useCallback(() => {
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  // Memoize PanResponder creation
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 3);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > height * 0.2 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);

      // Simplify animation to reduce performance impact
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const flatListRef = useRef(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} tint="dark" style={styles.blurView}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.outsideModalArea} />
          </TouchableWithoutFeedback>
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }]
              }
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.dragArea}>
              <View style={styles.dragIndicator} />
              
              <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#181725" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <FlatList
              ref={flatListRef}
              data={[{ key: 'content' }]}
              renderItem={() => (
                <View style={styles.contentContainer}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.categoriesGrid}>
                      {CATEGORIES.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={[
                            styles.categoryChip,
                            filters.selectedCategories.includes(category.id) && styles.categoryChipSelected
                          ]}
                          onPress={() => handleCategoryToggle(category.id)}
                        >
                          <Text style={[
                            styles.categoryChipText,
                            filters.selectedCategories.includes(category.id) && styles.categoryChipTextSelected
                          ]}>
                            {category.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <View style={styles.sortOptions}>
                      {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.sortOption,
                            filters.sortBy === option.id && styles.sortOptionSelected
                          ]}
                          onPress={() => handleSortChange(option.id)}
                        >
                          <Text style={[
                            styles.sortOptionText,
                            filters.sortBy === option.id && styles.sortOptionTextSelected
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Type</Text>
                    <View style={styles.productTypesGrid}>
                      {PRODUCT_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={[
                            styles.productTypeChip,
                            filters.selectedProductTypes.includes(type.id) && styles.productTypeChipSelected
                          ]}
                          onPress={() => handleProductTypeToggle(type.id)}
                        >
                          <Text style={[
                            styles.productTypeChipText,
                            filters.selectedProductTypes.includes(type.id) && styles.productTypeChipTextSelected
                          ]}>
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.stockToggle}
                    onPress={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                  >
                    <Text style={styles.stockToggleText}>Show In Stock Only</Text>
                    <View style={[
                      styles.checkbox,
                      filters.inStockOnly && styles.checkboxSelected
                    ]}>
                      {filters.inStockOnly && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.key}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.flatListContent}
              onResponderTerminationRequest={() => translateY._value > 10}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.7}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  outsideModalArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  dragArea: {
    paddingHorizontal: 20,
  },
  dragIndicator: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  contentContainer: {
    padding: 20,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryChip: {
    backgroundColor: '#F2F3F2',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  categoryChipSelected: {
    backgroundColor: '#53B175',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#181725',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  sortOptions: {
    backgroundColor: '#F2F3F2',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  sortOptionSelected: {
    backgroundColor: '#53B175',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#181725',
  },
  sortOptionTextSelected: {
    color: '#FFFFFF',
  },
  productTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  productTypeChip: {
    backgroundColor: '#F2F3F2',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  productTypeChipSelected: {
    backgroundColor: '#53B175',
  },
  productTypeChipText: {
    fontSize: 14,
    color: '#181725',
  },
  productTypeChipTextSelected: {
    color: '#FFFFFF',
  },
  stockToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockToggleText: {
    fontSize: 16,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#53B175',
    borderColor: '#53B175',
  },
  applyButton: {
    backgroundColor: '#53B175',
    margin: 12,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    color: '#53B175',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;