import { View, Text, StyleSheet, TouchableOpacity, InteractionManager, ActivityIndicator, Platform, Dimensions } from 'react-native';
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { organicProducts } from '../data/productCategories/organicProducts';
import { freshFruitsVegetables } from '../data/productCategories/freshFruitsVegetables';
import { cookingOilGhee } from '../data/productCategories/cookingOilGhee';
import { meatFish } from '../data/productCategories/meatFish';
import { bakerySnacks } from '../data/productCategories/bakerySnacks';
import { dairyEggs } from '../data/productCategories/dairyEggs';
import { beverages } from '../data/productCategories/beverages';
import { frozenFoods } from '../data/productCategories/frozenFoods';
import { spicesAndSeasonings } from '../data/productCategories/spicesAndSeasonings';
import { riceAndGrains } from '../data/productCategories/riceAndGrains';
import ProductCard from '../components/common/ProductCard';
const { SafeAreaView } = require('../../components/common');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 50) / 2;
const ITEM_HEIGHT = 240;

export default function CategoryItemsScreen() {
    const { categoryName } = useLocalSearchParams();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const listRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                setIsReady(true);
                setIsLoading(false);
            }, 50);
        });

        return () => interactionPromise.cancel();
    }, []);

    const categoryDataMap = useMemo(() => ({
        'Fresh Fruits & Vegetables': freshFruitsVegetables,
        'Cooking Oil & Ghee': cookingOilGhee,
        'Meat & Fish': meatFish,
        'Bakery & Snacks': bakerySnacks,
        'Dairy & Eggs': dairyEggs,
        'Beverages': beverages,
        'Frozen Foods': frozenFoods,
        'Spices & Seasonings': spicesAndSeasonings,
        'Rice & Grains': riceAndGrains,
        'Organic Products': organicProducts
    }), []);

    // Pre-process products to optimize rendering
    const categoryProducts = useMemo(() => {
        const products = categoryDataMap[categoryName] || [];
        return products.map(product => ({
            ...product,
            key: `${product.id}-${product.name}`, // Pre-compute keys
            // Pre-process the pieces field to avoid computations during render
            displayPieces: product.weight || product.quantity || product.volume || product.pieces || ''
        }));
    }, [categoryName, categoryDataMap]);

    // Optimized product card component for list items
    const ProductCardItem = useCallback(({ item }) => (
        <View style={styles.productCardWrapper}>
            <ProductCard
                id={item.id}
                name={item.name}
                pieces={item.displayPieces}
                price={item.price}
                img={item.img}
                inStock={item.inStock}
            />
        </View>
    ), []);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
                <ActivityIndicator size="large" color="#53B175" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#181725" />
                </TouchableOpacity>
                <Text style={styles.title}>{categoryName}</Text>
            </View>

            <FlashList
                ref={listRef}
                data={categoryProducts}
                renderItem={ProductCardItem}
                keyExtractor={(item) => item.key}
                numColumns={2}
                estimatedItemSize={220} // ITEM_HEIGHT ilə eyni olsun
                contentContainerStyle={styles.productsGrid}
                showsVerticalScrollIndicator={false}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={3}
                removeClippedSubviews={Platform.OS === 'android'}
                overrideItemLayout={(layout, item) => {
                    layout.size = 220; // ITEM_HEIGHT ilə eyni olsun
                }}
            />
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
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#181725',
        flex: 1,
    },
    productsGrid: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'android' ? 20 : 10,
    },
    productCardWrapper: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        marginBottom: 10,
        marginHorizontal: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});