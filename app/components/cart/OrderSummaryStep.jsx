import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderSummaryStep = ({ 
  totalAmount, 
  deliveryFee, 
  tax, 
  finalTotal, 
  address, 
  paymentMethod, 
  onPrevious, 
  onPlaceOrder 
}) => {
  return (
    <>
      <Text style={styles.stepTitle}>Order Summary</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.deliveryInfoContainer}>
          <Text style={styles.deliveryInfoTitle}>Delivery Information</Text>
          <Text style={styles.deliveryInfoText}>{address}</Text>
          <Text style={styles.deliveryInfoTitle}>Payment Method</Text>
          <Text style={styles.deliveryInfoText}>
            {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
          </Text>
        </View>
      </View>
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.placeOrderButton} onPress={onPlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 20,
  },
  summaryContainer: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  summaryValue: {
    fontSize: 14,
    color: '#181725',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#53B175',
  },
  deliveryInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  deliveryInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    minWidth: 100,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#181725',
    fontSize: 16,
    fontWeight: '500',
  },
  placeOrderButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrderSummaryStep;