import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const OrderProcessingStep = () => {
  return (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color="#53B175" />
      <Text style={styles.processingText}>Processing your order...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#181725',
    textAlign: 'center',
  },
});

export default OrderProcessingStep;