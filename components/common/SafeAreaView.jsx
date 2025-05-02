import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';

/**
 * A custom SafeAreaView component that works across platforms without
 * requiring explicit import of react-native-safe-area-context in each file.
 * 
 * This component adds appropriate padding based on the platform.
 */
const SafeAreaView = ({ style, children, edges = ['top', 'right', 'bottom', 'left'] }) => {
  // Create padding styles based on the edges prop
  const paddingStyles = {};
  
  if (edges.includes('top') && Platform.OS === 'ios') {
    paddingStyles.paddingTop = 44; // iOS notch height
  } else if (edges.includes('top') && Platform.OS === 'android') {
    paddingStyles.paddingTop = StatusBar.currentHeight || 0;
  }
  
  // Bottom padding for iOS home indicator
  if (edges.includes('bottom') && Platform.OS === 'ios') {
    paddingStyles.paddingBottom = 34; // iOS home indicator height
  }
  
  return (
    <View style={[styles.container, paddingStyles, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

// Using module.exports instead of export default to avoid _interopRequireDefault issues
module.exports = SafeAreaView;