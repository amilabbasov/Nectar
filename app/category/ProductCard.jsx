import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const ProductCard = ({ id, name, pieces, price, img, inStock }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  // Convert inStock to boolean to ensure it's properly evaluated
  const isInStock = inStock === undefined ? true : Boolean(inStock);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isInStock) {
      addToCart({ 
        id, 
        name, 
        pieces, 
        price, 
        img, 
        quantity: 1 
      });
    }
  };

  const handlePress = () => {
    router.push(`/product/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[
      styles.container,
      !isInStock && styles.outOfStockContainer
    ]}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof img === 'string' ? { uri: img } : img}
          style={styles.productImage}
          contentFit="contain"
          cachePolicy="memory"
          priority="low"
        />
        {!isInStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>{name}</Text>
        <Text style={styles.productQuantity}>{pieces}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>${price}</Text>

          {/* Add to Basket Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              !isInStock && styles.disabledAddButton
            ]}
            onPress={handleAddToCart}
            onStartShouldSetResponder={() => true}
            disabled={!isInStock}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
  },
  outOfStockContainer: {
    opacity: 0.8,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  productImage: {
    width: 90,
    height: 90,
  },
  detailsContainer: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181725',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  addButton: {
    backgroundColor: '#53B175',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledAddButton: {
    backgroundColor: '#CCCCCC',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
});

export default memo(ProductCard);