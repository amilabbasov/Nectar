import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { useSearch } from './hooks/useSearch';
import { organicProducts } from './data/productCategories/organicProducts';
import { freshFruitsVegetables } from './data/productCategories/freshFruitsVegetables';
import { dairyEggs } from './data/productCategories/dairyEggs';
import { beverages } from './data/productCategories/beverages';
import { bakerySnacks } from './data/productCategories/bakerySnacks';
import { frozenFoods } from './data/productCategories/frozenFoods';
import { meatFish } from './data/productCategories/meatFish';
import { cookingOilGhee } from './data/productCategories/cookingOilGhee';
import { riceAndGrains } from './data/productCategories/riceAndGrains';
import { spicesAndSeasonings } from './data/productCategories/spicesAndSeasonings';
import ProductCard from './components/common/ProductCard';

export default function SearchScreen() {

    const allProducts = [
        ...organicProducts.map(product => ({ ...product, categoryType: 'organic' })),
        ...freshFruitsVegetables.map(product => ({ ...product, categoryType: 'fresh' })),
        ...dairyEggs.map(product => ({ ...product, categoryType: 'dairy' })),
        ...beverages.map(product => ({ ...product, categoryType: 'beverage' })),
        ...bakerySnacks.map(product => ({ ...product, categoryType: 'bakery' })),
        ...frozenFoods.map(product => ({ ...product, categoryType: 'frozen' })),
        ...meatFish.map(product => ({ ...product, categoryType: 'meat' })),
        ...cookingOilGhee.map(product => ({ ...product, categoryType: 'cookingOilGhee' })),
        ...riceAndGrains.map(product => ({ ...product, categoryType: 'riceAndGrains' })),
        ...spicesAndSeasonings.map(product => ({ ...product, categoryType: 'spicesAndSeasonings' }))
    ];

    console.log('Total products loaded:', allProducts.length);

    const { searchQuery, setSearchQuery, filteredData, handleSearch } = useSearch(allProducts);

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        handleSearch(text, allProducts);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Image
                        source={require('./assets/images/appItems/search.png')}
                        style={styles.searchIcon}
                        resizeMode="contain"
                    />
                    <TextInput
                        placeholder="Search Products"
                        style={styles.searchInput}
                        placeholderTextColor="#7C7C7C"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                </View>
            </View>

            {/* Search Results */}
            <View style={styles.resultsContainer}>
                {searchQuery ? (
                    <Text style={styles.resultsText}>
                        {filteredData.length} results found for "{searchQuery}"
                    </Text>
                ) : (
                    <Text style={styles.resultsText}>Search for products</Text>
                )}

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => `${item.categoryType}-${item.name || item.id}`}
                    numColumns={2}
                    contentContainerStyle={styles.productsGrid}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            style={styles.productCard}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F3F2',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000000',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
        paddingLeft: 10,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    resultsText: {
        fontSize: 16,
        color: '#7C7C7C',
        marginVertical: 16,
    },
    productsGrid: {
        paddingBottom: 20,
    },
    productCard: {
        width: '48%',
        marginHorizontal: '1%',
        marginBottom: 16,
    },
}); 