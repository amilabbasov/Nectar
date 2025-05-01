// This file contains hardcoded coordinates for all cities supported by the app
// Used to display locations on the map without requiring geocoding permissions

const LOCATION_COORDINATES = {
  // Azerbaijan
  'Baku': { latitude: 40.4093, longitude: 49.8671 },
  'Ganja': { latitude: 40.6829, longitude: 46.3725 },
  'Sumgait': { latitude: 40.5898, longitude: 49.6679 },
  
  // Germany
  'Berlin': { latitude: 52.5200, longitude: 13.4050 },
  'Munich': { latitude: 48.1351, longitude: 11.5820 },
  'Hamburg': { latitude: 53.5511, longitude: 9.9937 },
  
  // France
  'Paris': { latitude: 48.8566, longitude: 2.3522 },
  'Lyon': { latitude: 45.7640, longitude: 4.8357 },
  'Marseille': { latitude: 43.2965, longitude: 5.3698 },
  
  // United Kingdom
  'London': { latitude: 51.5074, longitude: -0.1278 },
  'Manchester': { latitude: 53.4808, longitude: -2.2426 },
  'Edinburgh': { latitude: 55.9533, longitude: -3.1883 },
  
  // India
  'Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
  
  // Italy
  'Rome': { latitude: 41.9028, longitude: 12.4964 },
  'Milan': { latitude: 45.4642, longitude: 9.1900 },
  'Naples': { latitude: 40.8518, longitude: 14.2681 },
  
  // Japan
  'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
  'Osaka': { latitude: 34.6937, longitude: 135.5023 },
  'Kyoto': { latitude: 35.0116, longitude: 135.7681 },
  
  // Russia
  'Moscow': { latitude: 55.7558, longitude: 37.6173 },
  'Saint Petersburg': { latitude: 59.9343, longitude: 30.3351 },
  'Kazan': { latitude: 55.8304, longitude: 49.0661 },
  
  // Turkey
  'Istanbul': { latitude: 41.0082, longitude: 28.9784 },
  'Ankara': { latitude: 39.9334, longitude: 32.8597 },
  'Izmir': { latitude: 38.4237, longitude: 27.1428 },
  
  // United States
  'New York': { latitude: 40.7128, longitude: -74.0060 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'Chicago': { latitude: 41.8781, longitude: -87.6298 },
  
  // Australia
  'Sydney': { latitude: -33.8688, longitude: 151.2093 },
  'Melbourne': { latitude: -37.8136, longitude: 144.9631 },
  'Brisbane': { latitude: -27.4698, longitude: 153.0251 },
  
  // Brazil
  'Rio de Janeiro': { latitude: -22.9068, longitude: -43.1729 },
  'São Paulo': { latitude: -23.5505, longitude: -46.6333 },
  'Belo Horizonte': { latitude: -19.9167, longitude: -43.9345 },
  
  // Canada
  'Toronto': { latitude: 43.6532, longitude: -79.3832 },
  'Vancouver': { latitude: 49.2827, longitude: -123.1207 },
  'Montreal': { latitude: 45.5017, longitude: -73.5673 },
  
  // China
  'Beijing': { latitude: 39.9042, longitude: 116.4074 },
  'Shanghai': { latitude: 31.2304, longitude: 121.4737 },
  'Guangzhou': { latitude: 23.1291, longitude: 113.2644 },
  
  // Egypt
  'Cairo': { latitude: 30.0444, longitude: 31.2357 },
  'Alexandria': { latitude: 31.2001, longitude: 29.9187 },
  'Giza': { latitude: 30.0131, longitude: 31.2089 },
  
  // Spain
  'Madrid': { latitude: 40.4168, longitude: -3.7038 },
  'Barcelona': { latitude: 41.3851, longitude: 2.1734 },
  'Valencia': { latitude: 39.4699, longitude: -0.3763 },
  
  // Kazakhstan
  'Astana': { latitude: 51.1694, longitude: 71.4491 },
  'Almaty': { latitude: 43.2220, longitude: 76.8512 },
  'Shymkent': { latitude: 42.3167, longitude: 69.5959 },
  
  // Netherlands
  'Amsterdam': { latitude: 52.3676, longitude: 4.9041 },
  'Rotterdam': { latitude: 51.9244, longitude: 4.4777 },
  'Utrecht': { latitude: 52.0907, longitude: 5.1214 },
  
  // Saudi Arabia
  'Riyadh': { latitude: 24.7136, longitude: 46.6753 },
  'Jeddah': { latitude: 21.4858, longitude: 39.1925 },
  'Dammam': { latitude: 26.4207, longitude: 50.0888 },
  
  // Ukraine
  'Kyiv': { latitude: 50.4501, longitude: 30.5234 },
  'Lviv': { latitude: 49.8397, longitude: 24.0297 },
  'Odesa': { latitude: 46.4825, longitude: 30.7233 },
  
  // Default fallback
  'default': { latitude: 40.4093, longitude: 49.8671 } // Default to Baku
};

export default LOCATION_COORDINATES;