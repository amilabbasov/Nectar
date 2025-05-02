import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const CategoryGrid = ({ categories, onCategoryPress }) => {
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
          borderWidth: 1,
        }
      ]}
      onPress={() => onCategoryPress(item.name)}
    >
      <Image
        source={item.img}
        style={styles.categoryImage}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategoryItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      columnWrapperStyle={styles.categoryRow}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 200,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
});

export default CategoryGrid;