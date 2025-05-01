import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './ProductCard';
import { meatFish } from '../../data/productCategories/meatFish';

const MeatSection = () => {
  const router = useRouter();
  // Get first 4 meat products
  const featuredMeat = meatFish.slice(0, 4);

  const handleSeeAll = () => {
    router.push({
      pathname: '/products/all',
      params: { category: 'meat', title: 'Meat & Fish' }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meat & Fish</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {featuredMeat.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <ProductCard
              id={item.id}
              name={item.name}
              pieces={item.weight || item.volume || item.quantity || ''}
              price={item.price}
              img={item.img}
              inStock={item.inStock}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
  },
  seeAll: {
    fontSize: 16,
    color: '#53B175',
    fontWeight: '500',
  },
  productsContainer: {
    paddingRight: 16,
  },
  cardWrapper: {
    marginRight: 16,
    width: 160,
  },
});

export default MeatSection;