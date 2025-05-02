import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderCompleteStep = ({ onClose }) => {
  return (
    <View style={styles.completeContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#53B175" />
      </View>
      <Text style={styles.completeTitle}>Order Placed!</Text>
      <Text style={styles.completeText}>
        Your order has been placed successfully. You can check the status in My Orders section.
      </Text>
      <TouchableOpacity 
        style={styles.completeButton} 
        onPress={onClose}
      >
        <Text style={styles.completeButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  completeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#53B175',
    marginBottom: 12,
  },
  completeText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 24,
  },
  completeButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderCompleteStep;