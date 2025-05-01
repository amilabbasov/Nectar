import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { groceryCategories } from '../data/groceryCategories';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const category = groceryCategories.find(cat => cat.id === id);

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Category not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{category.name}</Text>
      </View>
      {/* Add your category content here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
}); 