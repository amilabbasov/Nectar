import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

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
  
  useEffect(() => {
    if (visible) {
      translateY.setValue(height);

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 12,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) { // End state
      const translationY = event.nativeEvent.translationY;

      if (translationY > 300) {
        Animated.timing(translateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
          speed: 12,
        }).start();
      }
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const handleProductTypeToggle = (typeId) => {
    setFilters(prev => ({
      ...prev,
      selectedProductTypes: prev.selectedProductTypes.includes(typeId)
        ? prev.selectedProductTypes.filter(id => id !== typeId)
        : [...prev.selectedProductTypes, typeId]
    }));
  };

  const handleSortChange = (sortOption) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortOption
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      selectedCategories: [],
      sortBy: 'none',
      selectedProductTypes: [],
      inStockOnly: false
    });
    onClear();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={50} style={styles.blurView}>
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleHandlerStateChange}
          >
            <Animated.View 
              style={[
                styles.modalContent, 
                { 
                  transform: [{ 
                    translateY: translateY.interpolate({
                      inputRange: [0, 1000],
                      outputRange: [0, 1000],
                      extrapolate: 'clamp'
                    }) 
                  }],
                }
              ]}
            >
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

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
                {/* Categories */}
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

                {/* Sort By */}
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

                {/* Product Types */}
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

                {/* In Stock Only */}
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
              </ScrollView>

              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
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
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  dragIndicator: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  scrollContent: {
    padding: 20,
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
    color: '#181725',
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
    margin: 20,
    borderRadius: 12,
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