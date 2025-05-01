import React, { ReactElement, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Platform, InteractionManager } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface CustomCarouselProps {
  data: any[];
  renderItem: (item: any) => ReactElement;
  autoPlay?: boolean;
  loop?: boolean;
  autoPlayInterval?: number;
  useNativeDriver?: boolean;
  removeClippedSubviews?: boolean;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  initialNumToRender?: number;
}

const { width } = Dimensions.get('window');
const carouselWidth = width * 0.9;

export const CustomCarousel: React.FC<CustomCarouselProps> = ({
  data,
  renderItem,
  autoPlay = true,
  loop = true,
  autoPlayInterval = 3000,
  useNativeDriver = true,
  removeClippedSubviews = false,
  maxToRenderPerBatch = 2,
  windowSize = 5,
  initialNumToRender = 1,
}) => {
  // Delay heavy animations on Android
  const [isReady, setIsReady] = useState(Platform.OS !== 'android');
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Use InteractionManager to ensure UI is ready before starting carousel
      InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
    }
    
    return () => {
      // Clean up any resources
    };
  }, []);

  // Android-specific optimization settings
  const androidSettings = Platform.OS === 'android' ? {
    scrollAnimationDuration: 1000,
    panGestureHandlerProps: {
      activeOffsetX: [-10, 10],
    },
    modeConfig: {
      parallaxScrollingScale: 0.9,
      parallaxScrollingOffset: 40,
    },
    withAnimation: {
      type: "timing" as const, // This is already correct
      config: {
        duration: 500,
      },
    },
  } : {
    // Spring animation for iOS
    withAnimation: {
      type: "spring" as const, // Add 'as const' here
      config: {
        damping: 20,
        mass: 1,
        stiffness: 100,
      },
    },
  };
  
  // Return placeholder or nothing until ready on Android
  if (!isReady) {
    return <View style={[styles.container, styles.placeholder]} />;
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop={loop}
        width={carouselWidth}
        height={carouselWidth * 0.3}
        autoPlay={autoPlay && isReady}
        autoPlayInterval={Platform.OS === 'android' ? autoPlayInterval + 2000 : autoPlayInterval}
        data={data}
        scrollAnimationDuration={Platform.OS === 'android' ? 1000 : 2500}
        renderItem={({ item }) => renderItem(item)}
        enabled={true}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        testID="banner-carousel"
        {...androidSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  placeholder: {
    width: carouselWidth,
    height: carouselWidth * 0.3,
    borderRadius: 12,
    backgroundColor: '#F2F3F2',
  },
});