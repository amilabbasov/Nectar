import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Stack } from 'expo-router';
import { groceryCategories } from '../data/groceryCategories';

export default function GroceriesScreen() {
  const router = useRouter();

  const handleBackToShop = () => {
    router.back();
  };

  const getCategoryType = (categoryId) => {
    // Map grocery category IDs to product category types
    const categoryMap = {
      fruits: 'fresh',
      vegetables: 'fresh',
      meat: 'meat',
      fish: 'meat',
      dairy: 'dairy',
      beverages: 'beverage',
      snacks: 'bakery',
      frozen: 'frozen',
      cooking: 'cookingOilGhee',
      rice: 'riceAndGrains',
      spices: 'spicesAndSeasonings',
      organic: 'organic',
      bread: 'bakery'
    };
    return categoryMap[categoryId] || categoryId;
  };

  const renderGroceryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.backgroundColor }]}
      onPress={() => {
        router.push({
          pathname: '/products/all',
          params: {
            category: getCategoryType(item.id),
            title: item.name
          }
        });
      }}
    >
      <Image
        source={typeof item.img === 'string' ? { uri: item.img } : item.img}
        style={styles.categoryIcon}
        contentFit="contain"
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Groceries",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackToShop}
              style={styles.backButton}
            >
              <Image
                source={require('../assets/images/appItems/goBack.png')}
                style={styles.backIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />

      <FlatList
        data={groceryCategories}
        renderItem={renderGroceryItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  gridContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
}); 