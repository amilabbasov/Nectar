import { organicProducts } from '../data/productCategories/organicProducts';
import { freshFruitsVegetables } from '../data/productCategories/freshFruitsVegetables';
import { dairyEggs } from '../data/productCategories/dairyEggs';
import { beverages } from '../data/productCategories/beverages';
import { bakerySnacks } from '../data/productCategories/bakerySnacks';
import { frozenFoods } from '../data/productCategories/frozenFoods';
import { meatFish } from '../data/productCategories/meatFish';
import { cookingOilGhee } from '../data/productCategories/cookingOilGhee';
import { riceAndGrains } from '../data/productCategories/riceAndGrains';
import { spicesAndSeasonings } from '../data/productCategories/spicesAndSeasonings';

// Define a comprehensive Product interface that covers all possible product properties
export interface Product {
  id: string;
  name: string;
  price: number;
  img: any;
  inStock?: boolean;
  categoryType: string;
  // Optional properties that vary by product type
  description?: string;
  weight?: string | number;
  volume?: string | number;
  pieces?: string | number;
  quantity?: string | number;
  category?: string;
}

// Helper function to safely convert string values to numbers if needed
const safeNumberConversion = (value: string | number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return isNaN(Number(value)) ? undefined : Number(value);
};

// Transform each product to conform to the Product interface
const transformProduct = (product: any, categoryType: string): Product => {
  return {
    ...product,
    categoryType,
    // Convert string values to numbers if needed
    weight: safeNumberConversion(product.weight),
    volume: safeNumberConversion(product.volume),
    pieces: safeNumberConversion(product.pieces),
    quantity: safeNumberConversion(product.quantity),
    // Ensure inStock is a boolean
    inStock: product.inStock === undefined ? true : Boolean(product.inStock)
  };
};

// Create the combined products array using the transformer function
export const ALL_PRODUCTS: Product[] = [
  ...organicProducts.map(product => transformProduct(product, 'organic')),
  ...freshFruitsVegetables.map(product => transformProduct(product, 'fresh')),
  ...dairyEggs.map(product => transformProduct(product, 'dairy')),
  ...beverages.map(product => transformProduct(product, 'beverage')),
  ...bakerySnacks.map(product => transformProduct(product, 'bakery')),
  ...frozenFoods.map(product => transformProduct(product, 'frozen')),
  ...meatFish.map(product => transformProduct(product, 'meat')),
  ...cookingOilGhee.map(product => transformProduct(product, 'cookingOilGhee')),
  ...riceAndGrains.map(product => transformProduct(product, 'riceAndGrains')),
  ...spicesAndSeasonings.map(product => transformProduct(product, 'spicesAndSeasonings'))
];

// Function to get products by category
export function getProductsByCategory(categoryType: string): Product[] {
  return ALL_PRODUCTS.filter(product => product.categoryType === categoryType);
}

// Function to search products by name or description
export function searchProducts(query: string): Product[] {
  if (!query || query.trim() === '') {
    return ALL_PRODUCTS;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return ALL_PRODUCTS.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = product.description ? 
      product.description.toLowerCase().includes(normalizedQuery) : false;
    
    return nameMatch || descriptionMatch;
  });
}

// Interface for filter options
export interface FilterOptions {
  selectedCategories?: string[];
  sortBy?: 'none' | 'priceLowHigh' | 'priceHighLow' | 'nameAZ' | 'nameZA';
  selectedProductTypes?: string[];
  inStockOnly?: boolean;
}

// Function to filter products based on criteria
export function filterProducts(
  products: Product[] = ALL_PRODUCTS, 
  options: FilterOptions = {}
): Product[] {
  const {
    selectedCategories = [],
    sortBy = 'none',
    selectedProductTypes = [],
    inStockOnly = false
  } = options;
  
  let filtered = [...products];

  // Apply category filter
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product =>
      selectedCategories.includes(product.categoryType)
    );
  }

  // Apply product type filter
  if (selectedProductTypes.length > 0) {
    filtered = filtered.filter(product => {
      if (selectedProductTypes.includes('weight') && product.weight) return true;
      if (selectedProductTypes.includes('volume') && product.volume) return true;
      if (selectedProductTypes.includes('piece') && (product.pieces || product.quantity)) return true;
      return false;
    });
  }

  // Apply stock filter
  if (inStockOnly) {
    filtered = filtered.filter(product => product.inStock !== false);
  }

  // Apply sorting
  if (sortBy !== 'none') {
    filtered = filtered.slice().sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':
          return a.price - b.price;
        case 'priceHighLow':
          return b.price - a.price;
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  return filtered;
}

// Add this default export with all the utility functions
const productUtils = {
  ALL_PRODUCTS,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  transformProduct,
  safeNumberConversion
};

export default productUtils;