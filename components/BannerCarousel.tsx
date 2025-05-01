import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { Image } from 'expo-image';

// Use window dimensions once for better performance
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH * 0.9;
const BANNER_ASPECT_RATIO = 3.33;
const BANNER_HEIGHT = CAROUSEL_WIDTH / BANNER_ASPECT_RATIO;

const BANNER_IMAGES = [
  require('../app/assets/images/banners/banner1.jpg'),
  require('../app/assets/images/banners/banner2.jpg'),
  require('../app/assets/images/banners/banner3.jpg'),
];

export const BannerCarousel = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simple function to move to the next banner
  const moveToNextBanner = useCallback(() => {
    const nextIndex = (activeIndex + 1) % BANNER_IMAGES.length;
    
    // Reset animation value and start animation
    slideAnim.setValue(CAROUSEL_WIDTH); // Start from right side
    setActiveIndex(nextIndex);
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slideAnim]);

  // Function to select a specific banner
  const selectBanner = useCallback((index: number) => {
    if (index === activeIndex) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setActiveIndex(index);
    slideAnim.setValue(0); // Reset animation value
    startAutoRotation();
  }, [activeIndex, slideAnim]);
  
  // Start the auto rotation
  const startAutoRotation = useCallback(() => {
    timerRef.current = setTimeout(moveToNextBanner, 5000);
  }, [moveToNextBanner]);
  
  // Setup and cleanup
  useEffect(() => {
    startAutoRotation();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [startAutoRotation]);
  
  return (
    <View style={styles.container}>
      {/* Very simple banner display - just show the active banner */}
      <Animated.View 
        style={[
          styles.bannerContainer, 
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <Image
          source={BANNER_IMAGES[activeIndex]}
          style={styles.bannerImage}
          contentFit="cover"
          transition={0} // Disable transition for performance
          cachePolicy="memory-disk"
          recyclingKey={`banner-${activeIndex}`}
          priority="low"
        />
      </Animated.View>
      
      {/* Pagination indicators */}
      <View style={styles.pagination}>
        {BANNER_IMAGES.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectBanner(index)}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.activeDot
            ]}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: BANNER_HEIGHT + 30,
    paddingBottom: 10,
    marginTop: 20,
  },
  bannerContainer: {
    width: CAROUSEL_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F2F3F2',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  bannerImage: {
    width: CAROUSEL_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#F2F3F2',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(83, 177, 117, 0.3)',
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#53B175',
  },
});