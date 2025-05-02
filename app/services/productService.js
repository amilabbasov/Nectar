// Product service to centralize data loading and operations
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

// Map category IDs to display names
export const CATEGORY_NAMES = {
  'organic': 'Organic',
  'fresh': 'Fresh Fruits & Vegetables',
  'dairy': 'Dairy & Eggs',
  'beverage': 'Beverages',
  'bakery': 'Bakery & Snacks',
  'frozen': 'Frozen Foods',
  'meat': 'Meat & Fish',
  'cookingOilGhee': 'Cooking Oil & Ghee',
  'riceAndGrains': 'Rice & Grains',
  'spicesAndSeasonings': 'Spices & Seasonings'
};

// Load all products with category types
export const loadAllProducts = () => {
  return [
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
};

// Filter products based on search query
export const searchProducts = (products, query) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return products;
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    (product.description && product.description.toLowerCase().includes(searchTerm))
  );
};

// Filter products based on filter criteria
export const filterProducts = (products, filters) => {
  let filtered = [...products];
  
  // Apply category filter
  if (filters.selectedCategories.length > 0) {
    filtered = filtered.filter(product =>
      filters.selectedCategories.includes(product.categoryType)
    );
  }

  // Apply product type filter
  if (filters.selectedProductTypes.length > 0) {
    filtered = filtered.filter(product => {
      if (filters.selectedProductTypes.includes('weight') && product.weight) return true;
      if (filters.selectedProductTypes.includes('volume') && product.volume) return true;
      if (filters.selectedProductTypes.includes('piece') && product.pieces) return true;
      return false;
    });
  }

  // Apply in-stock filter
  if (filters.inStockOnly) {
    filtered = filtered.filter(product => product.inStock !== false);
  }

  // Apply sorting
  if (filters.sortBy !== 'none') {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'priceLowHigh': return a.price - b.price;
        case 'priceHighLow': return b.price - a.price;
        case 'nameAZ': return a.name.localeCompare(b.name);
        case 'nameZA': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }
  
  return filtered;
};

// Get products by category
export const getProductsByCategory = (products, categoryName) => {
  return products.filter(product => product.categoryType === categoryName);
};

// Paginate products
export const paginateProducts = (products, page, itemsPerPage) => {
  const start = 0;
  const end = page * itemsPerPage;
  return products.slice(start, end);
};

export default {
  CATEGORY_NAMES,
  loadAllProducts,
  searchProducts,
  filterProducts,
  getProductsByCategory,
  paginateProducts
};