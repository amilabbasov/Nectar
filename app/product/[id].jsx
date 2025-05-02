import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, AlertSafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { freshFruitsVegetables } from '../data/productCategories/freshFruitsVegetables';
import { organicProducts } from '../data/productCategories/organicProducts';
import { dairyEggs } from '../data/productCategories/dairyEggs';
import { beverages } from '../data/productCategories/beverages';
import { bakerySnacks } from '../data/productCategories/bakerySnacks';
import { frozenFoods } from '../data/productCategories/frozenFoods';
import { meatFish } from '../data/productCategories/meatFish';
import { cookingOilGhee } from '../data/productCategories/cookingOilGhee';
import { riceAndGrains } from '../data/productCategories/riceAndGrains';
import { spicesAndSeasonings } from '../data/productCategories/spicesAndSeasonings';
import { bestSellers } from '../data/bestSellers';
const { SafeAreaView } = require('../../components/common');

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const [quantity, setQuantity] = useState(1);
    const [showDetails, setShowDetails] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        setIsFavorited(isFavorite(id));
    }, [id, isFavorite]);

    // Combine all product categories
    const allProducts = [
        ...bestSellers,
        ...freshFruitsVegetables,
        ...organicProducts,
        ...dairyEggs,
        ...beverages,
        ...bakerySnacks,
        ...frozenFoods,
        ...meatFish,
        ...cookingOilGhee,
        ...riceAndGrains,
        ...spicesAndSeasonings
    ];

    // Find the product by id
    const product = allProducts.find(p => p.id === id) || {
        name: "Product Not Found",
        pieces: "",
        price: 0,
        img: null
    };


    // Nutritional information based on product category
    const getNutrition = () => {
        const defaultNutrition = {
            calories: "52kcal",
            protein: "0.3g",
            carbs: "14g",
            fiber: "2.4g"
        };

        return defaultNutrition;
    };

    const handleAddToCart = () => {
        addToCart({
            ...product,
            id: id,
            quantity: quantity
        });
        router.back();
    };

    const updateQuantity = (increment) => {
        setQuantity(prev => Math.max(1, prev + increment));
    };

    const handleFavoritePress = () => {
        if (isFavorited) {
            removeFromFavorites(id);
            setIsFavorited(false);
        } else {
            // Only add to favorites if product is in stock
            if (product.inStock) {
                addToFavorites(product);
                setIsFavorited(true);
            } else {
                // Show alert when trying to add out-of-stock item to favorites
                Alert.alert(
                    "Cannot Add to Favorites",
                    "Sorry, you cannot add out-of-stock products to favorites.",
                    [{ text: "OK", onPress: () => {} }]
                );
            }
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#181725" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={handleFavoritePress} 
                        style={[
                            styles.favoriteButton,
                            !product.inStock && !isFavorited && styles.favoriteButtonDisabled
                        ]}
                    >
                        <Ionicons 
                            name={isFavorited ? "heart" : "heart-outline"} 
                            size={24} 
                            color={isFavorited ? "#FF6B6B" : (!product.inStock ? "#CCCCCC" : "#181725")} 
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.productImageContainer}>
                    {product.img ? (
                        <Image
                            source={product.img}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.missingImageContainer}>
                            <Ionicons name="image-outline" size={48} color="#7C7C7C" />
                            <Text style={styles.missingImageText}>No Image Available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productQuantity}>
                        {product.weight || product.volume || product.pieces || product.quantity}
                    </Text>

                    {!product.inStock && (
                        <View style={styles.stockStatusContainer}>
                            <Text style={styles.stockStatusText}>Not in Stock</Text>
                        </View>
                    )}

                    <View style={styles.quantityPriceContainer}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity 
                                onPress={() => updateQuantity(-1)} 
                                style={styles.quantityButton}
                                disabled={!product.inStock}
                            >
                                <Ionicons name="remove" size={24} color="#181725" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity 
                                onPress={() => updateQuantity(1)} 
                                style={styles.quantityButton}
                                disabled={!product.inStock}
                            >
                                <Ionicons name="add" size={24} color="#181725" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.productPrice}>${(product.price * quantity).toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.addToCartButton,
                            !product.inStock && styles.addToCartButtonDisabled
                        ]} 
                        onPress={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        <Text style={styles.addToCartText}>
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Text>
                    </TouchableOpacity>

                    {/* Product Detail */}
                    <TouchableOpacity
                        style={styles.detailSection}
                        onPress={() => setShowDetails(!showDetails)}
                    >
                        <Text style={styles.sectionTitle}>Product Detail</Text>
                        <Ionicons
                            name={showDetails ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#181725"
                        />
                    </TouchableOpacity>
                    {showDetails && (
                        <Text style={styles.description}>
                            This premium quality {product.name.toLowerCase()} is carefully selected to ensure
                            the best taste and nutritional value. Perfect for a healthy diet and lifestyle.
                        </Text>
                    )}

                    {/* Nutritions */}
                    <TouchableOpacity style={styles.nutritionButton}>
                        <Text style={styles.sectionTitle}>Nutritions</Text>
                        <View style={styles.nutritionTag}>
                            <Text style={styles.nutritionText}>100gr</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Nutrition Details */}
                    <View style={styles.nutritionDetails}>
                        {Object.entries(getNutrition()).map(([key, value]) => (
                            <Text key={key} style={styles.nutritionItem}>
                                • {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                            </Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backButton: {
        padding: 8,
    },
    favoriteButton: {
        padding: 8,
    },
    favoriteButtonDisabled: {
        opacity: 0.7,
    },
    scrollView: {
        flex: 1,
    },
    productImageContainer: {
        alignItems: 'center',
        padding: 16,
    },
    productImage: {
        width: '100%',
        height: 250,
    },
    productInfo: {
        padding: 16,
    },
    productName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#181725',
    },
    productQuantity: {
        fontSize: 16,
        color: '#7C7C7C',
        marginBottom: 24,
    },
    stockStatusContainer: {
        backgroundColor: '#FFE5E5',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    stockStatusText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    quantityPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 45,
        height: 45,
        borderRadius: 17,
        backgroundColor: '#F2F3F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 20,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: '600',
        color: '#181725',
    },
    addToCartButton: {
        backgroundColor: '#53B175',
        borderRadius: 19,
        padding: 16,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    addToCartButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    detailSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#181725',
    },
    description: {
        fontSize: 13,
        color: '#7C7C7C',
        lineHeight: 21,
        marginTop: 8,
    },
    nutritionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
    },
    nutritionTag: {
        backgroundColor: '#EBEBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    nutritionText: {
        fontSize: 12,
        color: '#7C7C7C',
    },
    nutritionDetails: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    nutritionItem: {
        fontSize: 14,
        color: '#7C7C7C',
        marginBottom: 8,
    },
    missingImageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#F2F3F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    missingImageText: {
        marginTop: 8,
        fontSize: 16,
        color: '#7C7C7C',
    },
});