import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const GroceriesSection = ({ categories }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with See all button */}
      <View style={styles.header}>
        <Text style={styles.title}>Groceries</Text>
        <TouchableOpacity onPress={() => router.push('/groceries')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
          >
            <Image
              source={typeof category.img === 'string' ? { uri: category.img } : category.img}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
  seeAll: {
    fontSize: 16,
    color: '#53B175',
    fontWeight: '500',
  },
  categoryCard: {
    width: 200,
    height: 100,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    flexShrink: 1,
  },
});

export default GroceriesSection;